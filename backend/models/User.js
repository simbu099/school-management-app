const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'student', 'parent'], 
    default: 'student' 
  },
  // Student/Parent-க்கு மட்டும் அவங்க Roll Number-ஐ Map பண்ண இந்த field முக்கியம்
  studentRollNo: { 
    type: String, 
    required: function() { return this.role !== 'admin'; } 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);