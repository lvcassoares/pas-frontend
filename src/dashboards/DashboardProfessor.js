import React, { useState } from 'react';
import '../App.css';
import Dashboard from './Dashboard';

// Dados fictícios
const dummyClasses = [
  { id: 1, name: 'Turma 101 - Manhã' },
  { id: 2, name: 'Turma 203 - Tarde' },
];

const dummyStudentsByClass = {
  1: [
    { id: 10, name: 'Ana Silva', grade: 7.5 },
    { id: 11, name: 'Bruno Costa', grade: 9.0 },
  ],
  2: [
    { id: 20, name: 'Carla Dias', grade: 6.0 },
    { id: 21, name: 'Daniel Faria', grade: 8.0 },
  ],
};

const DashboardProfessor = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  const handleSelectClass = (classId) => {
    setSelectedClass(dummyClasses.find(c => c.id === classId));
    setStudents(dummyStudentsByClass[classId]);
  };

  const handleGradeChange = (studentId, newGrade) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, grade: parseFloat(newGrade) } : s
    ));
    // No app real, aqui você faria uma chamada API para salvar a nova nota.
  };

  if (!selectedClass) {
    return (
      <div className="container">
        <h2>Minhas Turmas</h2>
        <p>Selecione uma turma para ver os alunos e gerenciar as notas.</p>
        {dummyClasses.map(c => (
          <div key={c.id} className="card">
            <h3>{c.name}</h3>
            <button onClick={() => handleSelectClass(c.id)} className="btn btn-primary">
              Gerenciar Turma
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => setSelectedClass(null)} className="btn btn-secondary" style={{marginBottom: '20px'}}>
        ← Voltar para Turmas
      </button>
      <h2>Gerenciando: {selectedClass.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Nome do Aluno</th>
            <th>Nota Atual</th>
            <th>Alterar Nota</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.grade.toFixed(1)}</td>
              <td>
                <input 
                  type="number" 
                  step="0.1" 
                  defaultValue={student.grade} 
                  onChange={(e) => handleGradeChange(student.id, e.target.value)}
                  style={{ width: '80px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardProfessor;