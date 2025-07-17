import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const DashboardAluno = () => {
  const [grades, setGrades] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const formatTurmaName = (nomeTurma) => {
    if (!nomeTurma) return "N/A";
    const matches = nomeTurma.match(/([A-Z]+)([A-Z]+)/);
    if (matches && matches.length === 3) {
      const lingua = matches[1].charAt(0) + matches[1].slice(1).toLowerCase();
      const nivel = matches[2].charAt(0) + matches[2].slice(1).toLowerCase();
      return `${lingua} - ${nivel}`;
    }
    return nomeTurma;
  };

  const getStatus = (nota) => {
    if (nota === null || nota === undefined) return "Em andamento";
    if (nota >= 6) return "Aprovado";
    if (nota >= 4) return "Recuperação";
    return "Reprovado";
  };

  const getStatusClass = (nota) => {
    if (nota === null || nota === undefined) return "status-in-progress";
    if (nota >= 6) return "status-approved";
    if (nota >= 4) return "status-recovery";
    return "status-failed";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user.id) {
          throw new Error("Usuário não autenticado ou ID não disponível");
        }

        // 1. Buscar turmas e notas do aluno
        const turmaRes = await fetch(
          `http://localhost:8080/turma/aluno/${user.id}`
        );
        if (!turmaRes.ok) throw new Error("Erro ao carregar as turmas");
        const turmaData = await turmaRes.json();
        setGrades(turmaData);

        const turmaIds = turmaData.map((t) => t.turmaId);

        // 2. Buscar todas as aulas
        const aulaRes = await fetch(`http://localhost:8080/aulas`);
        if (!aulaRes.ok) throw new Error("Erro ao carregar as aulas");
        const aulaData = await aulaRes.json();

        // 3. Filtrar aulas que pertencem às turmas do aluno
        const aulasFiltradas = aulaData.filter((aula) =>
          turmaIds.includes(aula.turmaId)
        );
        setAulas(aulasFiltradas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getAulasDaTurma = (turmaId) => {
    return aulas.filter((aula) => aula.turmaId === turmaId);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner"></div>
        <p>Carregando suas notas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <strong>Erro:</strong> {error}
          <button
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-light ml-2"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container dashboard-aluno">
      <div className="dashboard-header">
        <h2>Meu Desempenho Acadêmico</h2>
        <p className="subtitle">
          Visualize suas notas e status em cada disciplina
        </p>
      </div>

      {grades.length === 0 ? (
        <div className="no-grades">
          <i className="fas fa-book-open"></i>
          <p>Nenhuma turma matriculada no momento.</p>
        </div>
      ) : (
        <div className="grades-container">
          {grades.map((grade, index) => {
            const aulasDaTurma = getAulasDaTurma(grade.turmaId);

            return (
              <div key={index} className="grade-card">
                <div className="grade-header">
                  <h3>{formatTurmaName(grade.nomeTurma)}</h3>
                  <span className="turma-id">Turma #{grade.turmaId}</span>
                </div>

                <div className="grade-content">
                  <div className="grade-info">
                    <div className="grade-value">
                      <span className="label">Nota:</span>
                      <span
                        className={`value ${
                          grade.notaFinal === null ? "not-available" : ""
                        }`}
                      >
                        {grade.notaFinal !== null
                          ? grade.notaFinal.toFixed(1)
                          : "--"}
                      </span>
                    </div>

                    <div className="grade-status">
                      <span className="label">Status:</span>
                      <span
                        className={`status ${getStatusClass(grade.notaFinal)}`}
                      >
                        {getStatus(grade.notaFinal)}
                      </span>
                    </div>
                  </div>

                  {grade.notaFinal !== null && (
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${grade.notaFinal * 10}%` }}
                      ></div>
                      <div className="progress-labels">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Seção de aulas */}
                {aulasDaTurma.length > 0 && (
                  <div className="aulas-section">
                    <h4>Próximas Aulas</h4>
                    <ul className="aulas-list">
                      {aulasDaTurma.map((aula) => (
                        <li key={aula.id}>
                          <span>
                            {new Date(aula.data).toLocaleDateString()}
                          </span>{" "}
                          - {aula.horaInicio} às {aula.horaFim}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardAluno;
