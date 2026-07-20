const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  studentRollNo: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);