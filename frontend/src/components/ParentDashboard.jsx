import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentDashboard({ token, user, onLogout }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:5000/api/portal/dashboard/${user.studentRollNo}`, config);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally { setLoading(false); }
        };
        fetchDashboardData();
    }, [token, user]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h1 className="text-dark font-weight-bold">
                        {user.role === 'parent' ? `👋 Parent Portal: ${user.name}` : `🎓 Student Portal: ${user.name}`}
                    </h1>
                    <p className="text-muted mb-0">Review assignments, grade status, and historical data logs below.</p>
                </div>
                <button className="btn btn-outline-danger shadow-sm" onClick={onLogout}>Secure Logout</button>
            </div>

            {data ? (
                <div className="row g-4">
                    {/* Diagnostic Metric Summary Cards */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 p-4 bg-primary text-white mb-3">
                            <h6>Student Target Name</h6>
                            <h3>{data.profile.name}</h3>
                        </div>
                        <div className="card shadow-sm border-0 p-4 bg-dark text-white mb-3">
                            <h6>Assigned Class Grade</h6>
                            <h3>Class: {data.profile.grade}</h3>
                        </div>
                        <div className="card shadow-sm border-0 p-4 bg-info text-white">
                            <h6>Verified Roll Number</h6>
                            <h3>{data.profile.rollNo}</h3>
                        </div>
                    </div>

                    {/* Historical Timeline Feed */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 p-4">
                            <h4 className="mb-4 text-secondary">Attendance Timeline Performance History</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date Tracker Line</th>
                                            <th>Attendance Status Metric</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.attendance.map((log) => (
                                            <tr key={log._id}>
                                                <td>{new Date(log.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        log.status === 'Present' ? 'bg-success' : log.status === 'Absent' ? 'bg-danger' : 'bg-warning'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td><span className="text-muted italic small">{log.remarks || 'No notes.'}</span></td>
                                            </tr>
                                        ))}
                                        {data.attendance.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted">No operational attendance logs created yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning">No student data match context found linked to your profile roll number framework.</div>
            )}
        </div>
    );
}