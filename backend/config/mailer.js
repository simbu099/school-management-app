// backend/config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail id
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Student Portal Engine" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Identity - Registration OTP',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <h2 style="color: #4f46e5; text-align: center; font-weight: 700;">Account Verification</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.5;">Welcome to the Student Portal! Please use the temporary 6-digit One-Time Password (OTP) below to complete your sign-up phase:</p>
                <div style="background: #f1f5f9; letter-spacing: 6px; text-align: center; padding: 14px; font-size: 32px; font-weight: bold; color: #1e293b; border-radius: 8px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">This security code is active and valid for 10 minutes only.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };