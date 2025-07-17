import React from 'react';
import '../App.css';
import Dashboard from './Dashboard';

// Dados fictícios que viriam do backend
const dummyGrades = [
  { subject: 'Matemática', grade: 8.5 },
  { subject: 'Português', grade: 9.0 },
  { subject: 'História', grade: 7.0 },
  { subject: 'Ciências', grade: 8.0 },
];

const DashboardAluno = () => {
  return (
    <div className="container">
      <h2>Minhas Notas</h2>
      <p>Aqui estão suas notas atuais. Em caso de dúvidas, contate o professor.</p>
      <table>
        <thead>
          <tr>
            <th>Matéria</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {dummyGrades.map((item, index) => (
            <tr key={index}>
              <td>{item.subject}</td>
              <td>{item.grade.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardAluno;