// 1. File-oda top-laye .env configuration-ah active panna vendum 🚀
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load custom modules
const User = require('./models/User'); 
const { sendOTPEmail } = require('./config/mailer');

const app = express();

// Middleware Engine Layout Configuration
app.use(cors());
app.use(express.json());

// 🔌 Connect MongoDB Data Base Instance Context Configuration
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
}, {
    timestamps: true
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
// 🔒 STUDENT PORTAL AUTHENTICATION GATEWAY CONTROL
// ==========================================

// 1. SIGNUP & SEND OTP ROUTE
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, phone, email, dob, password } = req.body;
        
        if(!name || !phone || !email || !dob || !password) {
            return res.status(400).json({ message: "All sign up parameters details are required!" });
        }

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "An account is already linked to this email address." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a clean 6-digit random code string
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 Min target life trace

        const newUser = new User({
            name,
            phone,
            email,
            dob,
            password: hashedPassword,
            otp: generatedOtp,
            otpExpires: otpExpiryTime
        });

        await newUser.save();
        await sendOTPEmail(email, generatedOtp);

        res.status(201).json({ message: "Registration initiated! Check mail for validation OTP code status." });
    } catch (err) {
        console.error("SIGNUP ENGINE ERROR:", err);
        res.status(500).json({ message: "Internal server structural faults on registration." });
    }
});

// 2. VERIFY REGISTERED OTP ROUTE
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const targetUser = await User.findOne({ email });
        if (!targetUser) return res.status(404).json({ message: "Target authentication profile trace missing!" });

        if (targetUser.isVerified) {
            return res.status(400).json({ message: "Profile already validated successfully." });
        }

        if (targetUser.otp !== otp || new Date() > targetUser.otpExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP verification string matched." });
        }

        targetUser.isVerified = true;
        targetUser.otp = undefined;
        targetUser.otpExpires = undefined;
        await targetUser.save();

        const token = jwt.sign({ id: targetUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

        res.status(200).json({ 
            message: "Successfully logged in! Your student record access token generated.",
            token,
            user: { name: targetUser.name, email: targetUser.email }
        });
    } catch (err) {
        res.status(500).json({ message: "Verification processing failed." });
    }
});

// 3. SECURE LOGIN ROUTE WITH ACCESS CHECK
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const verifiedUser = await User.findOne({ email });
        if (!verifiedUser) return res.status(400).json({ message: "Invalid access criteria match patterns." });

        const isMatch = await bcrypt.compare(password, verifiedUser.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid access criteria match patterns." });

        // verify panna than student app kulla ponum validation patch check
        if (!verifiedUser.isVerified) {
            const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
            verifiedUser.otp = freshOtp;
            verifiedUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await verifiedUser.save();
            await sendOTPEmail(email, freshOtp);

            return res.status(403).json({ 
                message: "Verify panna thaan student app kulla ponum! A new validation code sent.",
                requiresVerification: true 
            });
        }

        const token = jwt.sign({ id: verifiedUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
        res.status(200).json({ 
            message: "Login Successful",
            token, 
            user: { name: verifiedUser.name, email: verifiedUser.email } 
        });
    } catch (err) {
        res.status(500).json({ message: "Login processing routine failure." });
    }
});


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
        console.error("CRITICAL BACKEND OPERATION TRACE:", err);
        res.status(400).json({ message: err.message || "Bad Request validation errors." });
    }
});

// 3. UPDATE ROUTE FIX
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
        await Attendance.deleteMany({ studentId: req.params.id }); 
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

// Server Initialization
const PORT = 5000;
app.listen(PORT, () => console.log(`Server absolute operational network tracking line target runtime active on port: ${PORT}`));