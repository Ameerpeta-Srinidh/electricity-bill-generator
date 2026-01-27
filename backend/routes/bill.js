const express = require("express");
const Bill = require("../models/Bill");
const User = require("../models/Application");

const router = express.Router();


const SLAB_RATES = {
  household: {
    serviceCharge: 25,
    slabs: [
      { limit: 50, rate: 1.5 },
      { limit: 50, rate: 2.0 },
      { limit: 50, rate: 2.5 },
      { limit: 50, rate: 3.0 },
      { limit: 50, rate: 3.5 },
      { limit: 50, rate: 4.0 },
      { limit: Infinity, rate: 4.5 }
    ]
  },
  commercial: {
    serviceCharge: 50,
    slabs: [
      { limit: 50, rate: 2.5 },
      { limit: 50, rate: 3.5 },
      { limit: 50, rate: 4.5 },
      { limit: 50, rate: 5.5 },
      { limit: 50, rate: 6.5 },
      { limit: 50, rate: 7.5 },
      { limit: Infinity, rate: 8.5 }
    ]
  },
  industry: {
    serviceCharge: 75,
    slabs: [
      { limit: 50, rate: 3.5 },
      { limit: 50, rate: 5.5 },
      { limit: 50, rate: 7.5 },
      { limit: 50, rate: 9.5 },
      { limit: 50, rate: 11.5 },
      { limit: 50, rate: 13.5 },
      { limit: Infinity, rate: 15.5 }
    ]
  }
};

function calculateBill(units, connectionType) {
  let amount = 0;
  let remainingUnits = units;

  const typeConfig = SLAB_RATES[connectionType];
  const serviceCharge = typeConfig ? typeConfig.serviceCharge : 0;
  const currentSlabs = typeConfig ? typeConfig.slabs : [];

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
      bill.fineAmount = 150;
      bill.amount += 150;
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
  res.json(SLAB_RATES);
});

module.exports = router;
