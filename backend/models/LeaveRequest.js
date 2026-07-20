const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  studentRollNo: { type: String, required: true },
  studentName: { type: String, required: true },
  reason: { type: String, required: true },
  leaveDate: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);