const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    studentRollNo: { type: String, required: true },
    subject: { type: String, required: true },
    examType: { type: String, required: true }, // e.g., Midterm, Final
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Mark', markSchema);