require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Custom Models
const User = require('./models/User'); 
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');

// New Real-time Modules Models
const Mark = require('./models/Mark');
const Fee = require('./models/Fee');

const app = express();

// Middleware Engine
app.use(cors());
app.use(express.json());

// Connect MongoDB Database Instance 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully (Cloud Live)'))
  .catch(err => console.error('DB Connection Error:', err));

// ==========================================
// 🔒 ROLE-BASED SYSTEM AUTHENTICATION
// ==========================================

// 1. STRAIGHTFORWARD SIGNUP (No OTP)
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, phone, email, password, role, studentRollNo } = req.body;
        
        if(!name || !phone || !email || !password || !role) {
            return res.status(400).json({ message: "All authentication details are required!" });
        }

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "An account is already linked to this email address." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            phone,
            email,
            password: hashedPassword,
            role,
            studentRollNo: (role === 'student' || role === 'parent') ? studentRollNo : null
        });

        await newUser.save();
        res.status(201).json({ message: "Account created successfully! You can now log in." });
    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.status(500).json({ message: "Internal server error during registration." });
    }
});

// 2. SECURE LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials match patterns." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials match patterns." });

        // Generate JWT Token filled with role-based claim attributes
        const token = jwt.sign(
            { id: user._id, role: user.role, studentRollNo: user.studentRollNo }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '1d' }
        );
        
        res.status(200).json({ 
            message: "Login Successful",
            token, 
            user: { 
                name: user.name, 
                email: user.email, 
                role: user.role,
                studentRollNo: user.studentRollNo
            } 
        });
    } catch (err) {
        res.status(500).json({ message: "Login processing routine failure." });
    }
});

// ==========================================
// 🛠️ AUTHORIZATION MIDDLEWARE
// ==========================================
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied. Missing Token." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token Schema" });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access forbidden. Unauthorized portal clearance level." });
        }
        next();
    };
};

// ==========================================
// 🚀 ADMIN CONTROL PIPELINES (CRUD)
// ==========================================

app.get('/api/students', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const data = await Student.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/api/students', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { name, rollNo, grade } = req.body;
        const newStudent = new Student({ name, rollNo, grade });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: "Error creating student database entry." });
    }
});

app.put('/api/students/:id', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: "Failed updating database metrics." });
    }
});

app.delete('/api/students/:id', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        await Attendance.deleteMany({ studentId: req.params.id }); 
        res.status(200).json({ message: "Student record purged successfully." });
    } catch (err) {
        res.status(500).json({ message: "Server action failed." });
    }
});

// ==========================================
// 📅 ATTENDANCE ENGINE (ADMIN ONLY)
// ==========================================

app.post('/api/attendance', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { studentId, status, remarks } = req.body;
        const newLog = new Attendance({ studentId, status, remarks });
        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        res.status(400).json({ message: "Failed logging attendance metadata entry." });
    }
});

app.get('/api/attendance/:studentId', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const history = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ message: "Failed fetching student attendance history logs." });
    }
});

// ==========================================
// 📝 ACADEMIC MARKS CONTROL (ADMIN / TEACHER MAPPING)
// ==========================================

// Add or update student marks
app.post('/api/marks/add', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { studentRollNo, subject, examType, marksObtained, maxMarks, remarks } = req.body;
        const newMark = new Mark({ studentRollNo, subject, examType, marksObtained, maxMarks, remarks });
        await newMark.save();
        res.status(201).json({ success: true, data: newMark });
    } catch (err) {
        res.status(400).json({ message: "Failed to upload grade metrics." });
    }
});

// ==========================================
// 💳 FINANCE & FEES MANAGEMENT (ADMIN ONLY)
// ==========================================

// Create a structural fee entry bill
app.post('/api/fees/create', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { studentRollNo, termName, amountDue, amountPaid, status, dueDate } = req.body;
        const newFee = new Fee({ studentRollNo, termName, amountDue, amountPaid, status, dueDate });
        await newFee.save();
        res.status(201).json({ success: true, data: newFee });
    } catch (err) {
        res.status(400).json({ message: "Failed to generate fee ledger invoice entry." });
    }
});

// ==========================================
// 👪 STUDENT & PARENT REAL-TIME VIEW GATEWAYS
// ==========================================

// Fetches structural profile data, attendance history, academic report cards, and balance statements
app.get('/api/portal/dashboard/:rollNo', verifyToken, requireRole(['student', 'parent', 'admin']), async (req, res) => {
    try {
        // Security check: Students/Parents can only read data associated with their own studentRollNo
        if (req.user.role !== 'admin' && req.user.studentRollNo !== req.params.rollNo) {
            return res.status(403).json({ message: "Unauthorized dashboard view matching violation context." });
        }

        const studentProfile = await Student.findOne({ rollNo: req.params.rollNo });
        if (!studentProfile) return res.status(404).json({ message: "Student record details missing." });

        // Run parallel queries across all features mapped to this unique student
        const attendanceLogs = await Attendance.find({ studentId: studentProfile._id }).sort({ date: -1 });
        const academicMarks = await Mark.find({ studentRollNo: req.params.rollNo });
        const financialFees = await Fee.find({ studentRollNo: req.params.rollNo });

        res.status(200).json({
            profile: studentProfile,
            attendance: attendanceLogs,
            marks: academicMarks,
            fees: financialFees
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving portal diagnostic summary matrices." });
    }
});

// Server Launch Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runtime seamlessly active on port: ${PORT}`));