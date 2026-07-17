import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthPage from './AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './components/StudentDashboard'; // Import the shared non-admin view layout

function App() {
  // 🔐 Authentication and Portal Session Layers
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Existing App State Structures (Used by Admin Dashboard views)
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [grade, setGrade] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [attendanceRemarks, setAttendanceRemarks] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // 🌍 PRODUCTION LIVE BACKEND URL (FIXED TO CLOUD ENDPOINT)
  const BACKEND_URL = 'https://school-management-app-ssvn.onrender.com';

  // 🛡️ Helper function to retrieve secure authorization config headers
  const getAuthConfig = () => {
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // 🔄 Auto Login Session Restore on Page Mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // 1. READ: Fetch Data (Restricted strictly to 'admin' roles)
  const fetchStudents = async () => {
    if (!token || currentUser?.role !== 'admin') return;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/students`, getAuthConfig());
      if (response.data && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Data fetch error trace setup mapping stack:", error);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchStudents();
    }
  }, [currentUser, token]);

  // 🔑 Handle Session Login Clearances
  const handleLoginSuccess = (userToken, userData) => {
    setToken(userToken);
    setCurrentUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.clear();
  };

  // 2. CREATE & UPDATE: Submit Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalName = String(name || '').trim();
    const finalRollNo = String(rollNo || '').trim();
    const finalGrade = String(grade || '').trim();

    if (!finalName || !finalRollNo || !finalGrade) {
      alert("Fields cannot be empty boss!");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`${BACKEND_URL}/api/students/${currentStudentId}`, { 
          name: finalName, 
          rollNo: finalRollNo, 
          grade: finalGrade 
        }, getAuthConfig());
        alert("Updated successfully!");
        setIsEditing(false);
        setCurrentStudentId('');
      } else {
        await axios.post(`${BACKEND_URL}/api/students`, { 
          name: finalName, 
          rollNo: finalRollNo, 
          grade: finalGrade 
        }, getAuthConfig());
        alert("Student registered successfully!");
      }
      
      setName(''); 
      setRollNo(''); 
      setGrade('');
      fetchStudents(); 
    } catch (error) {
      console.error("Submit Operation Error Log:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown server validation error.";
      alert(`Operation Failed: ${errorMsg}`);
    }
  };

  const startEdit = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student._id);
    setName(student.name || ''); 
    setRollNo(student.rollNo || ''); 
    setGrade(student.grade || '');
  };

  const cancelEdit = () => {
    setIsEditing(false); 
    setCurrentStudentId('');
    setName(''); 
    setRollNo(''); 
    setGrade('');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete record layout safe pipeline tracking trigger?")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/students/${id}`, getAuthConfig());
        fetchStudents();
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Failed to delete student record.");
      }
    }
  };

  const handleSetSelectedStudentForAttendance = (student) => {
    setSelectedStudent(student);
    setShowAttendanceModal(true);
  };

  const submitAttendance = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/attendance`, {
        studentId: selectedStudent._id,
        status: attendanceStatus,
        remarks: String(attendanceRemarks || '').trim()
      }, getAuthConfig());
      alert(`Attendance marked successfully!`);
      setShowAttendanceModal(false);
      setAttendanceRemarks('');
    } catch (error) {
      console.error("Attendance Submit Error:", error);
      alert(`Failed to mark attendance: ${error.response?.data?.message || error.message}`);
    }
  };

  const viewAttendanceHistory = async (student) => {
    setSelectedStudent(student);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attendance/${student._id}`, getAuthConfig());
      setAttendanceHistory(res.data || []);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Fetch History Error:", error);
      alert('Failed to fetch history logs.');
    }
  };

  // 🛑 Switch context layout to AuthPage if user layer session is clean/empty
  if (!token || !currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 🔀 DYNAMIC ROLE-BASED DASHBOARD CLEARANCES ROUTER
  if (currentUser.role === 'student' || currentUser.role === 'parent') {
    return (
      <StudentDashboard 
        token={token} 
        user={currentUser} 
        onLogout={handleLogout} 
      />
    );
  }

  // Otherwise, render full School System Admin layouts
  return (
    <>
      <div className="container-fluid bg-light py-2 px-4 d-flex justify-content-between align-items-center border-bottom shadow-sm">
        <span className="text-muted small">Logged in as: <strong>{currentUser.email} (Admin)</strong></span>
        <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Secure Logout</button>
      </div>

      <AdminDashboard 
        students={students} 
        name={name} 
        setName={setName} 
        rollNo={rollNo} 
        setRollNo={setRollNo} 
        grade={grade} 
        setGrade={setGrade}
        isEditing={isEditing} 
        handleSubmit={handleSubmit} 
        startEdit={startEdit} 
        cancelEdit={cancelEdit} 
        handleDelete={handleDelete}
        setSelectedStudent={handleSetSelectedStudentForAttendance} 
        setShowAttendanceModal={setShowAttendanceModal} 
        viewAttendanceHistory={viewAttendanceHistory}
      />

      {/* MODAL 1: MARK ATTENDANCE INTERFACE PANEL */}
      {showAttendanceModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>📅 Attendance For: <span style={{ color: '#007bff' }}>{selectedStudent?.name}</span></h4>
            
            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Status Layout:</label>
              <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
            
            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Remarks / Note:</label>
              <input type="text" placeholder="Remarks" value={attendanceRemarks} onChange={(e) => setAttendanceRemarks(e.target.value)} style={{ width: '94%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowAttendanceModal(false)} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
              <button onClick={submitAttendance} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Status</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HISTORY VERIFICATION PANEL */}
      {showHistoryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '500px', maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>⏳ Log Tracks: {selectedStudent?.name}</h4>
            
            {attendanceHistory.length === 0 ? <p style={{ color: '#777', textAlign: 'center', padding: '20px' }}>No logs tracked on this user block.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Date</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((log) => (
                    <tr key={log._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{new Date(log.date).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: log.status === 'Present' ? '#28a745' : log.status === 'Absent' ? '#dc3545' : '#ffc107' }}>{log.status}</td>
                      <td style={{ padding: '10px', color: '#555' }}>{log.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowHistoryModal(false)} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close Window</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;