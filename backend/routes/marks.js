const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');

// ➕ Add or update student marks (Admin / Teacher view action)
router.post('/add', async (req, res) => {
  try {
    const { studentRollNo, subject, examType, marksObtained, maxMarks, remarks } = req.body;
    
    const newMark = new Mark({ studentRollNo, subject, examType, marksObtained, maxMarks, remarks });
    await newMark.save();
    
    res.status(201).json({ success: true, message: 'Marks updated successfully!', data: newMark });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔍 Fetch marks profile for a specific student
router.get('/:rollNo', async (req, res) => {
  try {
    const studentMarks = await Mark.find({ studentRollNo: req.params.rollNo });
    res.status(200).json({ success: true, data: studentMarks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;