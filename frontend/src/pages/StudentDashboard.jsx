import React, { useState, useEffect } from 'react';

function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [grade, setGrade] = useState('');

  // 1. Backend-la irunthu student database records-a fetch panrom
  const fetchStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Data load logic error:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Add button-a click pannum pothu data trigger panra function
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!name || !rollNo || !grade) {
      alert("Ella box-aium type pannunga boss!");
      return;
    }

    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rollNo, grade: grade }), // schema variables mapping
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Server data injection block');
        return data;
      })
      .then(() => {
        alert("Student data added successfully!");
        setName('');
        setRollNo('');
        setGrade('');
        fetchStudents(); // Table refresh validation trigger
      })
      .catch((err) => alert(err.message));
  };

  // 3. Action column-la delete row clear function
  const handleDelete = (id) => {
    if (window.confirm("Record-a delete pannalaama boss?")) {
      fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' })
        .then(() => fetchStudents())
        .catch((err) => console.error(err));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Registration Header layout Form wrapper */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Register New Student</h2>
        <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
          <input 
            type="text" placeholder="Student Name" value={name} 
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '10px', width: '25%', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input 
            type="text" placeholder="Roll Number" value={rollNo} 
            onChange={(e) => setRollNo(e.target.value)}
            style={{ padding: '10px', width: '20%', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input 
            type="text" placeholder="Class / Grade" value={grade} 
            onChange={(e) => setGrade(e.target.value)}
            style={{ padding: '10px', width: '20%', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button type="submit" style={{ padding: '10px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Add
          </button>
        </form>
      </div>

      {/* Directory Main List Output Box */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', color: '#333', padding: '15px 0 5px 0' }}>Student Directory</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px 15px' }}>Name</th>
              <th style={{ padding: '12px 15px' }}>Roll No</th>
              <th style={{ padding: '12px 15px' }}>Class</th>
              <th style={{ padding: '12px 15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>No students found in DB. Add entry grid!</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px' }}>{student.name}</td>
                  <td style={{ padding: '12px 15px' }}>{student.rollNo}</td>
                  <td style={{ padding: '12px 15px' }}>{student.grade}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <button onClick={() => handleDelete(student._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default StudentDashboard;