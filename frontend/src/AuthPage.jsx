import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', 
    phone: '', 
    email: '', 
    password: '', 
    role: 'student', 
    studentRollNo: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 🌍 Live Production Backend Link
  const BACKEND_URL = 'https://school-management-app-ssvn.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        onLoginSuccess(res.data.token, res.data.user);
      } else {
        // Validation bypass: Admin-nu irundha empty schema validation text default string-ah pass pannuvom
        const signupData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          studentRollNo: formData.role === 'admin' ? 'ADMIN-BYPASS' : formData.studentRollNo
        };

        const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, signupData);
        setMessage(res.data.message);
        
        setFormData({
          name: '', phone: '', email: '', password: '', role: 'student', studentRollNo: ''
        });
        setIsLogin(true); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication lifecycle handshake failure.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow border-0 p-4" style={{ width: '420px', borderRadius: '12px' }}>
        <h2 className="text-center text-primary mb-4 font-weight-bold">
          {isLogin ? 'School Hub Access' : 'Create User Account'}
        </h2>
        
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {message && <div className="alert alert-success py-2 small">{message}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-3">
                <label className="form-label small font-weight-bold">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small font-weight-bold">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  className="form-control" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small font-weight-bold">Portal Role Profile</label>
                <select 
                  name="role" 
                  className="form-select" 
                  value={formData.role} 
                  onChange={handleChange}
                >
                  <option value="student">Student Dashboard</option>
                  <option value="parent">Parent Portal</option>
                  <option value="admin">Administrator Panel</option>
                </select>
              </div>
              {formData.role !== 'admin' && (
                <div className="mb-3">
                  <label className="form-label small font-weight-bold">Your Verification Roll Number</label>
                  <input 
                    type="text" 
                    name="studentRollNo" 
                    className="form-control" 
                    placeholder="e.g. ROLL-007" 
                    value={formData.studentRollNo} 
                    onChange={handleChange} 
                    required={formData.role !== 'admin'} 
                  />
                </div>
              )}
            </>
          )}

          <div className="mb-3">
            <label className="form-label small font-weight-bold">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label small font-weight-bold">Password Key</label>
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm mb-3">
            {isLogin ? 'Sign In Securely' : 'Register Profile Matrix'}
          </button>
        </form>

        <div className="text-center">
          <button 
            className="btn btn-link text-decoration-none btn-sm text-secondary" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
          >
            {isLogin ? "New user? Create an account here" : 'Have an account? Route to sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}