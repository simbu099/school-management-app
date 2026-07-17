import React, { useState } from 'react';
import axios from 'axios';

// 🌍 Live Production Backend Endpoint Link
const BACKEND_URL = 'https://school-management-app-ssvn.onrender.com';

export default function AdminDashboard({
  students,
  name,
  setName,
  rollNo,
  setRollNo,
  grade,
  setGrade,
  isEditing,
  handleSubmit,
  startEdit,
  cancelEdit,
  handleDelete,
  setSelectedStudent,
  viewAttendanceHistory
}) {
  // --- Extra Admin Operations States ---
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'marks' | 'fees'
  
  // Marks State
  const [markForm, setMarkForm] = useState({ studentRollNo: '', subject: '', examType: 'Midterm', marksObtained: '', maxMarks: 100, remarks: '' });
  // Fees State
  const [feeForm, setFeeForm] = useState({ studentRollNo: '', termName: 'Term 1', amountDue: '', amountPaid: 0, status: 'Pending' });

  const [uiMessage, setUiMessage] = useState({ type: '', text: '' });

  // Custom Intercept Form Submit to override local logic if required, else use standard props
  const handleLocalSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  // 📝 1. Log Marks Matrix Data
  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    setUiMessage({ type: '', text: '' });
    try {
      const res = await axios.post(`${BACKEND_URL}/api/marks/add`, markForm);
      setUiMessage({ type: 'success', text: res.data.message || 'Academic report record uploaded successfully!' });
      setMarkForm({ studentRollNo: '', subject: '', examType: 'Midterm', marksObtained: '', maxMarks: 100, remarks: '' });
    } catch (err) {
      setUiMessage({ type: 'danger', text: err.response?.data?.message || 'Operation Failed: Network Error on Marks Module.' });
    }
  };

  // 💰 2. Post Financial Fee Invoices
  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    setUiMessage({ type: '', text: '' });
    try {
      const res = await axios.post(`${BACKEND_URL}/api/fees/add`, feeForm);
      setUiMessage({ type: 'success', text: res.data.message || 'Fee financial ledger updated successfully!' });
      setFeeForm({ studentRollNo: '', termName: 'Term 1', amountDue: '', amountPaid: 0, status: 'Pending' });
    } catch (err) {
      setUiMessage({ type: 'danger', text: err.response?.data?.message || 'Operation Failed: Network Error on Fees Module.' });
    }
  };

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="p-4 mb-4 bg-white rounded-3 shadow-sm border d-flex align-items-center justify-content-between">
        <div>
          <h2 className="text-primary fw-bold mb-1">🏫 School Administrative Management</h2>
          <p className="text-muted mb-0 small">
            Configure student parameters, log real-time performance matrices, and trace operational accounting.
          </p>
        </div>
        <span className="badge bg-success text-white px-3 py-2 rounded-pill fw-bold animate-pulse">
          🟢 Live Database Connected
        </span>
      </div>

      {/* Tab Selectors Dynamic Toggle Control */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2">
        <button className={`btn btn-sm fw-bold px-3 ${activeTab === 'students' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('students')}>
          👨‍🎓 Students Profile Registry
        </button>
        <button className={`btn btn-sm fw-bold px-3 ${activeTab === 'marks' ? 'btn-success text-white' : 'btn-light'}`} onClick={() => setActiveTab('marks')}>
          📚 Academic Report Management
        </button>
        <button className={`btn btn-sm fw-bold px-3 ${activeTab === 'fees' ? 'btn-warning text-dark' : 'btn-light'}`} onClick={() => setActiveTab('fees')}>
          💳 Finance Fee Allocation
        </button>
      </div>

      {/* Global Module Action Feedback Alert Banner */}
      {uiMessage.text && (
        <div className={`alert alert-${uiMessage.type} py-2 mb-4 small fw-bold shadow-sm d-flex justify-content-between align-items-center`}>
          <span>{uiMessage.text}</span>
          <button type="button" className="btn-close small" onClick={() => setUiMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* RENDER VIEW SWITCH CONTAINER */}
      {activeTab === 'students' && (
        <div className="row g-4">
          {/* Left: Register/Edit Panel */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
              <h5 className="text-secondary mb-3 fw-bold border-bottom pb-2">
                {isEditing ? '✏️ Modify Student Profile' : '➕ Register New Student'}
              </h5>
              <form onSubmit={handleLocalSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Student Full Name</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Official Roll Number</label>
                  <input type="text" className="form-control" placeholder="e.g. ROLL-001" value={rollNo} onChange={(e) => setRollNo(e.target.value)} disabled={isEditing} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Assigned Grade / Class</label>
                  <input type="text" className="form-control" placeholder="Class A" value={grade} onChange={(e) => setGrade(e.target.value)} required />
                </div>
                <button type="submit" className={`btn w-100 fw-bold ${isEditing ? 'btn-warning text-dark' : 'btn-primary'}`}>
                  {isEditing ? 'Save Changes' : 'Confirm Registration'}
                </button>
                {isEditing && <button type="button" className="btn btn-outline-secondary btn-sm w-100 mt-2" onClick={cancelEdit}>Cancel</button>}
              </form>
            </div>
          </div>

          {/* Right: Data Table */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="text-secondary mb-3 fw-bold border-bottom pb-2">📋 Operational Registry Grid ({students.length})</h5>
              {students.length === 0 ? (
                <div className="text-center py-5 border rounded bg-light"><p className="text-muted mb-0">No records active inside database cluster pipeline.</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Grade</th>
                        <th className="text-center">Tracking Logs</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td><strong>{student.rollNo}</strong></td>
                          <td>{student.name}</td>
                          <td><span className="badge bg-primary-subtle text-primary px-2.5 py-1.5 rounded">{student.grade}</span></td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-1">
                              <button className="btn btn-sm btn-success px-2 text-white" onClick={() => setSelectedStudent(student)}>📅 Log</button>
                              <button className="btn btn-sm btn-outline-dark px-2" onClick={() => viewAttendanceHistory(student)}>⏳ History</button>
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-warning text-dark" onClick={() => startEdit(student)}>Edit</button>
                              <button className="btn btn-danger text-white" onClick={() => handleDelete(student._id)}>Purge</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'marks' && (
        <div className="card shadow-sm border-0 p-4 max-w-md mx-auto" style={{ maxWidth: '600px' }}>
          <h5 className="text-success mb-3 fw-bold border-bottom pb-2">📚 Post Academic Report Cards</h5>
          <form onSubmit={handleMarkSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Student Roll Number</label>
                <input type="text" className="form-control" placeholder="e.g. ROLL-001" value={markForm.studentRollNo} onChange={(e) => setMarkForm({ ...markForm, studentRollNo: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Subject Name</label>
                <input type="text" className="form-control" placeholder="Mathematics" value={markForm.subject} onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Exam Categorization</label>
                <select className="form-select" value={markForm.examType} onChange={(e) => setMarkForm({ ...markForm, examType: e.target.value })}>
                  <option value="Midterm">Midterm Examination</option>
                  <option value="Quarterly">Quarterly Examination</option>
                  <option value="Final">Annual Final Examination</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Obtained</label>
                <input type="number" className="form-control" value={markForm.marksObtained} onChange={(e) => setMarkForm({ ...markForm, marksObtained: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Max Limit</label>
                <input type="number" className="form-control" value={markForm.maxMarks} onChange={(e) => setMarkForm({ ...markForm, maxMarks: e.target.value })} required />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">Academic Remarks / Evaluation</label>
                <input type="text" className="form-control" placeholder="Excellent analytical skills shown." value={markForm.remarks} onChange={(e) => setMarkForm({ ...markForm, remarks: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-success text-white w-100 fw-bold mt-4 shadow-sm">Upload Matrix Mark Record</button>
          </form>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h5 className="text-warning mb-3 fw-bold border-bottom pb-2">💰 Generate Financial Invoices & Ledgers</h5>
          <form onSubmit={handleFeeSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Student Target Roll Number</label>
                <input type="text" className="form-control" placeholder="e.g. ROLL-001" value={feeForm.studentRollNo} onChange={(e) => setFeeForm({ ...feeForm, studentRollNo: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Term Session Name</label>
                <select className="form-select" value={feeForm.termName} onChange={(e) => setFeeForm({ ...feeForm, termName: e.target.value })}>
                  <option value="Term 1">Term 1 Basic Fees</option>
                  <option value="Term 2">Term 2 Academic Tuition</option>
                  <option value="Annual">Annual Maintenance Invoice</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Total Allocation Due ($)</label>
                <input type="number" className="form-control" placeholder="5000" value={feeForm.amountDue} onChange={(e) => setFeeForm({ ...feeForm, amountDue: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Total Instantly Paid ($)</label>
                <input type="number" className="form-control" value={feeForm.amountPaid} onChange={(e) => setFeeForm({ ...feeForm, amountPaid: e.target.value })} required />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">Payment Transaction Status Matrix</label>
                <select className="form-select" value={feeForm.status} onChange={(e) => setFeeForm({ ...feeForm, status: e.target.value })}>
                  <option value="Pending">Pending / Unpaid Ledger</option>
                  <option value="Partially Paid">Partially Paid Installment</option>
                  <option value="Paid">Fully Cleared / Paid Account</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-warning text-dark w-100 fw-bold mt-4 shadow-sm">Deploy Invoice Ledger Records</button>
          </form>
        </div>
      )}
    </div>
  );
}