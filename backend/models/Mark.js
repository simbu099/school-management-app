const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
    studentRollNo: { type: String, required: true },
    subject: { type: String, required: true },
    examType: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Mark', MarkSchema);