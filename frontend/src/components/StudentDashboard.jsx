import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentDashboard({ token, user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BACKEND_URL = 'https://school-management-app-ssvn.onrender.com';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${BACKEND_URL}/api/portal/dashboard/${user.studentRollNo}`, config);
        setData(res.data);
      } catch (err) {
        console.error("Portal metric collection crash:", err);
        setError(err.response?.data?.message || 'Failed to sync account profile metrics.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.studentRollNo) {
      fetchDashboardData();
    } else {
      setError('No student roll number profile context associated with this user.');
      setLoading(false);
    }
  }, [token, user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Top Professional Navbar Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <div>
          <h1 className="h2 text-dark font-weight-bold">
            {user.role === 'parent' ? `👪 Parent Portal: ${user.name}` : `🎓 Student Portal: ${user.name}`}
          </h1>
          <p className="text-muted mb-0 small">
            Real-time profile diagnostics and operational academic tracking loops.
          </p>
        </div>
        <button className="btn btn-outline-danger shadow-sm px-4" onClick={onLogout}>
          Secure Sign Out
        </button>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      {data && (
        <div className="row g-4">
          {/* Left Summary Grid Profile Cards */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 mb-3 bg-gradient bg-primary text-white">
              <div className="card-body p-4">
                <h6 className="text-white-50 uppercase small font-weight-bold">Student Identity</h6>
                <h3 className="card-title mb-0">{data.profile.name}</h3>
              </div>
            </div>
            <div className="card shadow-sm border-0 mb-3 bg-dark text-white">
              <div className="card-body p-4">
                <h6 className="text-muted small font-weight-bold">Registered Grade</h6>
                <h3 className="card-title mb-0">Class {data.profile.grade}</h3>
              </div>
            </div>
            <div className="card shadow-sm border-0 bg-info text-white">
              <div className="card-body p-4">
                <h6 className="text-white-50 small font-weight-bold">Database Roll No</h6>
                <h3 className="card-title mb-0">{data.profile.rollNo}</h3>
              </div>
            </div>
          </div>

          {/* Right Detailed Historical Timelines */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4">
              <h4 className="text-secondary mb-4 border-bottom pb-2">Live Attendance Metrics Timeline</h4>
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Calendar Date</th>
                      <th>Status Matrix</th>
                      <th>Operational Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.attendance.map((log) => (
                      <tr key={log._id}>
                        <td>{new Date(log.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge px-3 py-2 rounded-pill ${
                            log.status === 'Present' ? 'bg-success' : log.status === 'Absent' ? 'bg-danger' : 'bg-warning text-dark'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td><span className="text-muted small font-italic">{log.remarks || 'No notes left.'}</span></td>
                      </tr>
                    ))}
                    {data.attendance.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No official attendance record items found in database system layout.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}