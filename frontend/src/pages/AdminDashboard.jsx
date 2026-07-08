import React, { useState } from 'react';

function AdminDashboard({
  students, name, setName, rollNo, setRollNo, grade, setGrade,
  isEditing, handleSubmit, startEdit, cancelEdit, handleDelete,
  setSelectedStudent, setShowAttendanceModal, viewAttendanceHistory
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Live Client-side Filter Logic
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Metrics Engine Counters
  const totalStudents = students.length;
  const totalBatches = new Set(students.map(s => s.grade.trim().toLowerCase())).size;

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      {/* Navigation Top Header Bar */}
      <nav style={{ backgroundColor: '#007bff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>School Admin Pro Management</h1>
        <span style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          🟢 System Online
        </span>
      </nav>

      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 📊 DYNAMIC SUMMARY ANALYTICS PANEL CARDS */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flex: 1, borderLeft: '5px solid #007bff', transition: 'transform 0.2s' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#777', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Enrolled Students</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{totalStudents}</p>
          </div>
          
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flex: 1, borderLeft: '5px solid #6f42c1' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#777', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Departments / Batches</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{totalBatches}</p>
          </div>
          
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flex: 1, borderLeft: '5px solid #28a745' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#777', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Database Status</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#28a745', marginTop: '12px' }}>CONNECTED ACTIVE</p>
          </div>
        </div>

        {/* Form Register Section Box */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '20px' }}>
            {isEditing ? "📝 Edit Student System Matrix" : "➕ Register New Student Portfolio"}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
            <input 
              type="text" placeholder="Student Name" value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', width: '25%', fontSize: '14px' }}
            />
            <input 
              type="text" placeholder="Roll Number" value={rollNo} 
              onChange={(e) => setRollNo(e.target.value)}
              style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', width: '20%', fontSize: '14px' }}
            />
            <input 
              type="text" placeholder="Class / Grade" value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', width: '20%', fontSize: '14px' }}
            />
            
            <button type="submit" style={{ padding: '12px 28px', backgroundColor: isEditing ? '#ffc107' : '#28a745', color: isEditing ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {isEditing ? "Update Source" : "Add Student"}
            </button>

            {isEditing && (
              <button type="button" onClick={cancelEdit} style={{ padding: '12px 18px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Directory Listings and Filter Core */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f4f6f9', paddingBottom: '15px' }}>
            <h2 style={{ color: '#333', margin: 0, fontSize: '20px' }}>Student Management Directory</h2>
            
            <input 
              type="text" 
              placeholder="🔍 Search by Name, Roll No or Class..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 18px', width: '380px', border: '1px solid #ccc', borderRadius: '20px', outline: 'none', fontSize: '14px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '15px', fontWeight: '600' }}>Student Name</th>
                <th style={{ padding: '15px', fontWeight: '600' }}>Roll ID Number</th>
                <th style={{ padding: '15px', fontWeight: '600' }}>Allocated Class</th>
                <th style={{ padding: '15px', fontWeight: '600', textAlign: 'center' }}>Action Control Dashboard</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#777', fontSize: '15px' }}>
                    {students.length === 0 ? "No records active inside database cluster pipeline." : "No matching directory filters identified for current key."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '14px', fontSize: '14px', fontWeight: '500', color: '#333' }}>{student.name}</td>
                    <td style={{ padding: '14px', fontSize: '14px', color: '#555' }}>{student.rollNo}</td>
                    <td style={{ padding: '14px', fontSize: '14px', color: '#555' }}>
                      <span style={{ backgroundColor: '#e9ecef', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {student.grade}
                      </span>
                    </td>
                    <td style={{ padding: '14px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      
                      <button onClick={() => startEdit(student)} style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                        Edit
                      </button>

                      <button onClick={() => handleDelete(student._id)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                        Delete
                      </button>

                      <button onClick={() => setSelectedStudent(student)} style={{ padding: '6px 14px', backgroundColor: '#17a2b8', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                        📅 Mark Attendance
                      </button>
                      
                      <button onClick={() => viewAttendanceHistory(student)} style={{ padding: '6px 14px', backgroundColor: '#6f42c1', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                        ⏳ History Logs
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;