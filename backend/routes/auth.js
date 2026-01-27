const express = require("express");
const User = require("../models/Application");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, mobileNo, email, connectionType, password, address } = req.body;

    // Validation: Name must be alphabets only
    if (!/^[A-Za-z\s]+$/.test(fullName)) {
      return res.status(400).json({ error: "Name must contain only alphabets." });
    }

    // Validation: Phone number must be exactly 10 digits
    if (!/^\d{10}$/.test(mobileNo)) {
      return res.status(400).json({ error: "Mobile number must be exactly 10 digits." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const user = new User({
      fullName,
      mobileNo,
      email,
      connectionType,
      password,
      address,
      role: req.body.role || 'user',
      status: 'pending'
    });

    await user.save();
    res.json({ message: "Application submitted successfully. Please wait for admin approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ error: "Your application has been rejected." });
    }

    if (user.status === 'pending' && user.role === 'user') {
      return res.status(403).json({ error: "Your application is still pending approval." });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        serviceNumber: user.serviceNumber,
        mobileNo: user.mobileNo,
        connectionType: user.connectionType,
        currentUnits: user.currentUnits
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

module.exports = router;
