const mongoose = require("mongoose");
const { type } = require("os");

const applicationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        uppercase: true,
        required: [true, "fullname not provided"]
    },
    mobileNo: {
        type: String,
        required: true,
        unique: [true, "mobile number already exists"],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    email: {
        type: String,
        required: [true, "email not provided"],
        lowercase: true,
        unique: [true, "email already exists"],
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    connectionType: {
        type: String,
        enum: ["household", "industry", "commercial"],
        required: [true, "please specify your connection type"]
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
            },
            message: 'password must contain atleast 1 lowercase, 1 uppercase letters, 1 number,1 special character and atleast 8 characters of length'
        }
    },
    address: {
        houseNo: {
            type: String
        },
        locality: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: String,
            match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode'],
            validate: {
                validator: function (v) {
                    return /^[0-9]{6}$/.test(v);
                },
                message: 'Please enter a valid 6-digit pincode'
            }
        }
    },
    created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'employee', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    serviceNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    currentUnits: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Application", applicationSchema);
