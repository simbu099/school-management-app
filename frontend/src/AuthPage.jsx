// frontend/src/AuthPage.jsx
import React, { useState } from 'react';

const AuthPage = ({ onLoginSuccess }) => {
    // Modes: 'login', 'signup', 'otp'
    const [mode, setMode] = useState('login');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // Form Input Structures
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        dob: '',
        password: ''
    });
    const [otp, setOtp] = useState('');

    // 🌍 PRODUCTION LIVE BACKEND URL
    const BACKEND_URL = 'https://school-management-app-ssvn.onrender.com';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Form Submission (Login or Sign Up Core API Trigger)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
        
        try {
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mode === 'login' ? { email: formData.email, password: formData.password } : formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // If backend requires verification during login flow
                if (data.requiresVerification) {
                    setMessage(data.message);
                    setMode('otp');
                } else {
                    setError(data.message || 'Something went wrong');
                }
                return;
            }

            if (mode === 'signup') {
                setMessage(data.message);
                setMode('otp'); // Directly force OTP mode to verify email ID
            } else if (mode === 'login') {
                localStorage.setItem('token', data.token);
                onLoginSuccess(data.user);
            }
        } catch (err) {
            setError('Cannot reach backend authentication server metrics.');
        }
    };

    // OTP Token Match Dispatch Route Verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'OTP check mismatch error.');
                return;
            }

            // Successfully Verified! Set session and enter student dashboard
            localStorage.setItem('token', data.token);
            onLoginSuccess(data.user);
        } catch (err) {
            setError('OTP execution pipeline failure.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>
                    {mode === 'otp' ? 'Verification Step' : mode === 'login' ? 'Student Portal Sign In' : 'Create Student Account'}
                </h2>
                <p style={styles.subtitle}>
                    {mode === 'otp' ? 'Verify panna thaan student app kulla ponum 🔒' : 'Fill all parameter detail fields carefully'}
                </p>

                {error && <div style={styles.errorAlert}>{error}</div>}
                {message && <div style={styles.successAlert}>{message}</div>}

                {mode !== 'otp' ? (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        {mode === 'signup' && (
                            <>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Full Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} style={styles.input} placeholder="Enter full name" />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Phone Number</label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={styles.input} placeholder="Enter active contact number" />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Date of Birth</label>
                                    <input type="date" name="dob" required value={formData.dob} onChange={handleChange} style={styles.input} />
                                </div>
                            </>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} style={styles.input} placeholder="yourname@school.com" />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input type="password" name="password" required value={formData.password} onChange={handleChange} style={styles.input} placeholder="••••••••" />
                        </div>

                        <button type="submit" style={styles.button}>
                            {mode === 'login' ? 'Login Securely' : 'Sign Up & Get OTP'}
                        </button>

                        <div style={styles.toggleText}>
                            {mode === 'login' ? (
                                <p>Need an account? <span onClick={() => setMode('signup')} style={styles.link}>Sign Up here</span></p>
                            ) : (
                                <p>Already registered? <span onClick={() => setMode('login')} style={styles.link}>Login instead</span></p>
                            )}
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Enter your 6-Digit Email OTP</label>
                            <input type="text" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value)} style={{...styles.input, textAlign: 'center', letterSpacing: '6px', fontSize: '22px', fontWeight: 'bold'}} placeholder="000000" />
                        </div>
                        <button type="submit" style={styles.button}>Verify Code & Enter App</button>
                        <div style={styles.toggleText}>
                            <span onClick={() => setMode('login')} style={styles.link}>Back to Login Window</span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// 💎 Modern UI Font Layout System Styling Config
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a', // Clean Deep Slate modern look
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        padding: '24px'
    },
    card: {
        backgroundColor: '#1e293b',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid #334155'
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#f8fafc',
        textAlign: 'center',
        marginBottom: '6px'
    },
    subtitle: {
        fontSize: '14px',
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: '28px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#cbd5e1'
    },
    input: {
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #475569',
        fontSize: '14px',
        color: '#f8fafc',
        outline: 'none',
        backgroundColor: '#0f172a',
        transition: 'border-color 0.2s'
    },
    button: {
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#6366f1', // Smooth Indigo Font Tint Accent
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    toggleText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#94a3b8',
        marginTop: '8px'
    },
    link: {
        color: '#818cf8',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    errorAlert: {
        padding: '10px 14px',
        backgroundColor: '#451a03',
        color: '#f59e0b',
        borderRadius: '6px',
        fontSize: '13px',
        border: '1px solid #78350f',
        marginBottom: '16px'
    },
    successAlert: {
        padding: '10px 14px',
        backgroundColor: '#064e3b',
        color: '#34d399',
        borderRadius: '6px',
        fontSize: '13px',
        border: '1px solid #065f46',
        marginBottom: '16px'
    }
};

export default AuthPage;