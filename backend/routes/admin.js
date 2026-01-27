const express = require("express");
const User = require("../models/Application");

const router = express.Router();


router.get("/applications", async (req, res) => {
    try {
        const status = req.query.status || "pending";
        const applications = await User.find({ status: status });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: "Error fetching applications" });
    }
});


router.post("/approve", async (req, res) => {
    const { id } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.status !== "pending") {
            return res.status(400).json({ error: "Application is not pending" });
        }

        let serviceNumber;
        let isUnique = false;

        while (!isUnique) {
            serviceNumber = "SC" + Math.floor(100000 + Math.random() * 900000);
            const existingUser = await User.findOne({ serviceNumber });
            if (!existingUser) {
                isUnique = true;
            }
        }

        user.status = "approved";
        user.serviceNumber = serviceNumber;
        await user.save();

        res.json({ message: "Application approved", serviceNumber });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error approving application" });
    }
});

module.exports = router;
