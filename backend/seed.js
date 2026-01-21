const mongoose = require("mongoose");
const Application = require("./models/Application");

mongoose.connect("mongodb://127.0.0.1:27017/Electricity_DB")
    .then(() => console.log("MongoDB Connected for Seeding"))
    .catch(err => console.log(err));

const seedUsers = async () => {
    try {
        const adminExists = await Application.findOne({ email: "admin@ebill.com" });
        if (!adminExists) {
            const admin = new Application({
                fullName: "System Admin",
                email: "admin@ebill.com",
                mobileNo: "9999999999",
                password: "Admin@123",
                role: "admin",
                status: "approved",
                connectionType: "commercial"
            });
            await admin.save();
            console.log("Admin created");
        } else {
            console.log("Admin already exists");
        }
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
};

seedUsers();
