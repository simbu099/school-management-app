const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    studentRollNo: { type: String, required: true },
    termName: { type: String, required: true }, // e.g., Term 1, Annual Fee
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ['Paid', 'Pending', 'Partially Paid'], default: 'Pending' },
    dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);