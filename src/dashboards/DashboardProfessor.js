import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const DashboardProfessor = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState({ classes: true, students: false });
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Busca as turmas do professor
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:8080/turma", {});

        if (!response.ok) throw new Error("Erro ao carregar turmas");

        const allClasses = await response.json();
        setClasses(allClasses.filter((c) => c.professorId === user.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, classes: false }));
      }
    };

    fetchClasses();
  }, [user]);

  // Busca alunos quando uma turma é selecionada
  const fetchStudents = async (classId) => {
    setLoading((prev) => ({ ...prev, students: true }));
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/turma/${classId}/alunos`,
        {}
      );

      if (!response.ok) throw new Error("Erro ao carregar alunos");

      const alunos = await response.json();
      setStudents(alunos);
      setSelectedClass(classes.find((c) => c.id === classId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  };

  const handleGradeChange = async (alunoId, newGrade) => {
    try {
      // Converte para número e valida
      const nota = parseFloat(newGrade);
      if (isNaN(nota)) throw new Error("Nota inválida");

      const response = await fetch(
        "http://localhost:8080/turma/atribuir-nota",
        {
          method: "POST",
          headers: {
            Authorization: `${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aluno: alunoId, // Alterado de alunoId para aluno
            turma: selectedClass.id, // Alterado de turmaId para turma
            notaFinal: nota,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar nota");
      }

      // Atualiza localmente
      setStudents(
        students.map((s) =>
          s.alunoId === alunoId ? { ...s, notaFinal: nota } : s
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading.classes) {
    return <div className="container">Carregando turmas...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
        <button onClick={() => setError(null)} className="btn btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  if (!selectedClass) {
    return (
      <div className="container">
        <h2>Minhas Turmas</h2>

        {classes.length === 0 ? (
          <p>Nenhuma turma atribuída</p>
        ) : (
          <div className="row">
            {classes.map((c) => (
              <div key={c.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      {c.lingua} - {c.nivel}
                    </h5>
                    <p className="card-text">
                      <small className="text-muted">
                        {new Date(c.dataInicio).toLocaleDateString()} a{" "}
                        {new Date(c.dataTermino).toLocaleDateString()}
                      </small>
                    </p>
                    <button
                      onClick={() => fetchStudents(c.id)}
                      className="btn btn-primary"
                      disabled={loading.students}
                    >
                      {loading.students ? "Carregando..." : "Gerenciar Turma"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <button
        onClick={() => setSelectedClass(null)}
        className="btn btn-secondary mb-3"
      >
        ← Voltar para Turmas
      </button>

      <h2>
        {selectedClass.lingua} - {selectedClass.nivel}
      </h2>
      <p className="text-muted mb-4">
        {new Date(selectedClass.dataInicio).toLocaleDateString()} a{" "}
        {new Date(selectedClass.dataTermino).toLocaleDateString()}
      </p>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Matrícula</th>
              <th>Aluno</th>
              <th>Nota</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.alunoId}>
                <td>{student.matricula}</td>
                <td>{student.alunoNome}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={student.notaFinal ?? ""}
                    onChange={(e) =>
                      handleGradeChange(student.alunoId, e.target.value)
                    }
                    className="form-control"
                    style={{ width: "80px" }}
                  />
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleGradeChange(
                        student.alunoId,
                        document.querySelector(
                          `input[data-id="${student.alunoId}"]`
                        ).value
                      )
                    }
                    className="btn btn-sm btn-success"
                  >
                    Salvar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardProfessor;
