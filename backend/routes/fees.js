const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

// ➕ Generate a fee billing invoice
router.post('/create', async (req, res) => {
  try {
    const { studentRollNo, termName, amountDue, dueDate } = req.body;
    
    const newFee = new Fee({ studentRollNo, termName, amountDue, dueDate });
    await newFee.save();
    
    res.status(201).json({ success: true, message: 'Fee invoice generated!', data: newFee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔍 Fetch billing status for a student
router.get('/:rollNo', async (req, res) => {
  try {
    const feeRecords = await Fee.find({ studentRollNo: req.params.rollNo });
    res.status(200).json({ success: true, data: feeRecords });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;