const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  serviceNumber: String,
  units: Number,
  amount: Number,
  month: String,
  dueDate: Date,
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'overdue'],
    default: 'unpaid'
  },
  fineAmount: {
    type: Number,
    default: 0
  },
  serviceCharge: {
    type: Number,
    default: 0
  },
  paidDate: Date,
  periodStart: Date,
  periodEnd: Date
});

module.exports = mongoose.model("Bill", billSchema);
