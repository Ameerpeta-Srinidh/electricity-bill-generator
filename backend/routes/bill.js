const express = require("express");
const Bill = require("../models/Bill");
const User = require("../models/Application");

const router = express.Router();


function calculateBill(units, connectionType) {
  let amount = 0;
  let serviceCharge = 0;
  let remainingUnits = units;

  const slabs = {
    household: [
      { limit: 100, rate: 5 },
      { limit: 50, rate: 6 },
      { limit: 50, rate: 7 },
      { limit: Infinity, rate: 8 }
    ],
    commercial: [
      { limit: 100, rate: 10 },
      { limit: Infinity, rate: 15 }
    ],
    industry: [
      { limit: 100, rate: 15 },
      { limit: 100, rate: 18 },
      { limit: Infinity, rate: 20 }
    ]
  };

  let currentSlabs = [];

  switch (connectionType) {
    case 'household':
      serviceCharge = 50;
      currentSlabs = [
        { limit: 100, rate: 5 },
        { limit: 50, rate: 6 }, 
        { limit: 50, rate: 7 }, 
        { limit: Infinity, rate: 8 } 
      ];
      break;
    case 'commercial':
      serviceCharge = 100;
      currentSlabs = [
        { limit: 100, rate: 10 },
        { limit: 100, rate: 12 }, 
        { limit: Infinity, rate: 15 }
      ];
      break;
    case 'industry':
      serviceCharge = 200;
      currentSlabs = [
        { limit: 100, rate: 15 },
        { limit: 100, rate: 18 },
        { limit: Infinity, rate: 20 }
      ];
      break;
    default:
      serviceCharge = 70;
      currentSlabs = [{ limit: Infinity, rate: 8 }];
  }

  for (const slab of currentSlabs) {
    if (remainingUnits <= 0) break;
    const unitsInSlab = Math.min(remainingUnits, slab.limit);
    amount += unitsInSlab * slab.rate;
    remainingUnits -= unitsInSlab;
  }

  return { amount, slabs: currentSlabs, serviceCharge };
}

router.post("/generate", async (req, res) => {
  let { serviceNumber, currentReading } = req.body;

  console.log("Received Generate Request:", req.body);

  if (!serviceNumber) return res.status(400).json({ error: "Service Number is required" });

  serviceNumber = serviceNumber.trim().toUpperCase();

  console.log("Querying for Service Number:", serviceNumber);

  try {
    const user = await User.findOne({ serviceNumber });
    if (user) console.log("User Found:", user.fullName);
    else console.log("User Not Found for:", serviceNumber);

    if (!user) return res.status(404).json({ error: "User with this Service Number not found" });

    if (currentReading < user.currentUnits) {
      return res.status(400).json({ error: `New reading (${currentReading}) cannot be less than previous reading (${user.currentUnits})` });
    }

    const unitsConsumed = currentReading - user.currentUnits;
    const { amount, serviceCharge } = calculateBill(unitsConsumed, user.connectionType);

    const periodEnd = new Date();
    let periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - 30);

    const lastBill = await Bill.findOne({ serviceNumber }).sort({ periodEnd: -1 });
    if (lastBill && lastBill.periodEnd) {
      periodStart = lastBill.periodEnd;
    } else if (user.created) {
      periodStart = user.created;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    const bill = new Bill({
      serviceNumber,
      units: unitsConsumed,
      amount,
      serviceCharge,
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      dueDate,
      periodStart,
      periodEnd,
      status: 'unpaid'
    });

    await bill.save();

    user.currentUnits = currentReading;
    await user.save();

    res.json({ message: "Bill generated", bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating bill" });
  }
});

router.post("/pay/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });

    if (bill.status === 'paid') return res.status(400).json({ error: "Bill already paid" });

    const now = new Date();
    if (now > bill.dueDate) {
      bill.fineAmount = 100;
      bill.amount += 100;
      bill.status = 'overdue';
    }

    bill.status = 'paid';
    bill.paidDate = now;
    await bill.save();

    res.json({ message: "Bill paid successfully", bill });
  } catch (err) {
    res.status(500).json({ error: "Payment failed" });
  }
});


router.get("/history/:serviceNumber", async (req, res) => {
  const bills = await Bill.find({ serviceNumber: req.params.serviceNumber });
  res.json(bills);
});

router.get("/rates", (req, res) => {
  res.json({
    household: { rate: 5, serviceCharge: 50 },
    commercial: { rate: 10, serviceCharge: 100 },
    industry: { rate: 15, serviceCharge: 200 }
  });
});

module.exports = router;
