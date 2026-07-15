// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // verify panna thaan student app kulla poga mudiyum
    otp: { type: String },
    otpExpires: { type: Date }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);