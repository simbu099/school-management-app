import React from 'react';

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
  return (
    <div className="container py-5">
      {/* Welcome Banner Banner Layout Structure */}
      <div className="p-4 mb-5 bg-white rounded-3 shadow-sm border d-flex align-items-center justify-content-between">
        <div>
          <h2 className="text-dark font-weight-bold mb-1">🏫 School Administrative Hub</h2>
          <p className="text-muted mb-0 small">
            Manage formal student enrollments, modify core profiles, and coordinate dynamic attendance registers.
          </p>
        </div>
        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill font-weight-bold">
          System Live
        </span>
      </div>

      <div className="row g-4">
        {/* Left Column: Management Form Layout */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px', zIndex: 10 }}>
            <h4 className="text-secondary mb-3 font-weight-bold border-bottom pb-2">
              {isEditing ? '✏️ Modify Student Profile' : '➕ Register New Student'}
            </h4>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Student Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter full name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Official Roll Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., ROLL-101"
                  value={rollNo} 
                  onChange={(e) => setRollNo(e.target.value)} 
                  disabled={isEditing} // Prevent modifying the unique identifier code block during edit phase
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Assigned Grade / Class</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., Grade 10-A"
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)} 
                  required 
                />
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className={`btn w-100 fw-bold shadow-sm ${isEditing ? 'btn-warning text-dark' : 'btn-primary'}`}>
                  {isEditing ? 'Save Changes' : 'Confirm Registration'}
                </button>
                {isEditing && (
                  <button type="button" className="btn btn-outline-secondary w-50" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Dynamic Data Roster Board */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="text-secondary mb-4 font-weight-bold border-bottom pb-2">
              📋 Operational Student Registry Grid ({students.length})
            </h4>

            {students.length === 0 ? (
              <div className="text-center py-5 border rounded bg-light">
                <p className="text-muted mb-0">No student profile logs matching criteria tracked in system array memory context.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '15%' }}>Roll No</th>
                      <th style={{ width: '30%' }}>Name</th>
                      <th style={{ width: '20%' }}>Grade</th>
                      <th style={{ width: '15%' }} className="text-center">Tracking Logs</th>
                      <th style={{ width: '20%' }} className="text-end">Record Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td><strong>{student.rollNo}</strong></td>
                        <td>{student.name}</td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary px-2.5 py-1.5 rounded">
                            {student.grade}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <button 
                              className="btn btn-sm btn-success px-2.5 shadow-xs" 
                              title="Mark Attendance Status"
                              onClick={() => setSelectedStudent(student)}
                            >
                              📅 Log
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-dark px-2" 
                              title="View Log Metrics Timeline"
                              onClick={() => viewAttendanceHistory(student)}
                            >
                              ⏳ History
                            </button>
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm shadow-xs">
                            <button 
                              className="btn btn-outline-warning text-dark" 
                              onClick={() => startEdit(student)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-danger text-white" 
                              onClick={() => handleDelete(student._id)}
                            >
                              Purge
                            </button>
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
    </div>
  );
}