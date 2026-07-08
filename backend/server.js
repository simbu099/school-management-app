// 1. File-oda top-laye .env configuration-ah active panna vendum 🚀
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware Engine Layout Configuration Configuration
app.use(cors());
app.use(express.json());

// 🔌 Connect MongoDB Data Base Instance Context Configuration Control Layout
// Local 'mongodb://127.0.0.1...' link-ah thookitu process.env.MONGO_URI potachu! ✨
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Dynamic Engine Success Status Matrix (Cloud Live)'))
  .catch(err => console.log('DB Connection Crash:', err));

// ==========================================
// 📋 DATABASE SCHEMA MODELS LAYER STRUCTURE
// ==========================================
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true },
    grade: { type: String, required: true }
});
const Student = mongoose.model('Student', StudentSchema);

const AttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
    remarks: { type: String, default: '' },
    date: { type: Date, default: Date.now }
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

// ==========================================
// 🚀 REST API CORE ROUTERS CONTROLLERS CORE
// ==========================================

// 1. READ ALL STUDENTS
app.get('/api/students', async (req, res) => {
    try {
        const data = await Student.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Errors" });
    }
});

// 2. CREATE NEW STUDENT REGISTER
app.post('/api/students', async (req, res) => {
    try {
        const { name, rollNo, grade } = req.body;
        if (!name || !rollNo || !grade) {
            return res.status(400).json({ message: "Missing parameter details fields!" });
        }
        const newStudent = new Student({ name, rollNo, grade });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: "Bad Request validation errors." });
    }
});

// 3. UPDATE ROUTE FIX (Status 404/400 Mismatch Fix Patch Bypass Engine)
app.put('/api/students/:id', async (req, res) => {
    try {
        const { name, rollNo, grade } = req.body;
        const updated = await Student.findByIdAndUpdate(
            req.params.id, 
            { name, rollNo, grade }, 
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Student record id target missing trace!" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: "Validation or format parameter mismatch execution errors." });
    }
});

// 4. DELETE ROUTE PIPELINE
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        await Attendance.deleteMany({ studentId: req.params.id }); // Clean dependencies logic arrays
        res.status(200).json({ message: "Cleared successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Action Fail" });
    }
});

// ==========================================
// 📅 ATTENDANCE LOGIC OPERATION METRICS ENDPOINTS
// ==========================================

// MARK ATTENDANCE ACTION POST TRIGGER
app.post('/api/attendance', async (req, res) => {
    try {
        const { studentId, status, remarks } = req.body;
        if(!studentId || !status) {
            return res.status(400).json({ message: "Required variables status profile id target missing!" });
        }
        const newLog = new Attendance({ studentId, status, remarks });
        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        res.status(400).json({ message: "Attendance action payload execution crash." });
    }
});

// GET STUDENT ATTENDANCE LOG HISTORY
app.get('/api/attendance/:studentId', async (req, res) => {
    try {
        const history = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ message: "Log extraction error" });
    }
});

// Server Initialization Activation Execution Control Block Target
const PORT = 5000;
app.listen(PORT, () => console.log(`Server absolute operational network tracking line target runtime active on port: ${PORT}`));