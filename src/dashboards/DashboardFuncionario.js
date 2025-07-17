import React, { useState, useEffect } from "react";
import "../App.css";

const DashboardFuncionario = () => {
  const [view, setView] = useState("registerStudent");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados para o formulário de aluno
  const [studentForm, setStudentForm] = useState({
    nome: "",
    email: "",
    senha: "123456",
    telefone: "",
    endereco: "",
    matricula: "",
  });

  // Estados para o formulário de professor
  const [teacherForm, setTeacherForm] = useState({
    nome: "",
    email: "",
    senha: "123456",
    telefone: "",
    endereco: "",
    matricula: "",
    valorHora: "",
    linguas: [],
  });

  // Estados para o formulário de turma
  const [classForm, setClassForm] = useState({
    lingua: "INGLES",
    nivel: "INICIANTE",
    dataInicio: "",
    dataTermino: "",
    professorId: "",
    preco: "",
    valorArrecadado: 10,
  });

  // Estados para matrícula
  const [enrollment, setEnrollment] = useState({
    turmaId: "",
    alunoId: "",
  });

  // Estados para aula
  const [lessonForm, setLessonForm] = useState({
    turmaId: "",
    data: "",
    horaInicio: "",
    horaFim: "",
  });

  // Opções para selects
  const linguasOptions = ["INGLES", "ESPANHOL", "FRANCES"];
  const nivelOptions = ["INICIANTE", "INTERMEDIARIO", "AVANCADO"];

  // Buscar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [classesRes, studentsRes, teachersRes, lessonsRes] =
          await Promise.all([
            fetch("http://localhost:8080/turma"),
            fetch("http://localhost:8080/aluno"),
            fetch("http://localhost:8080/professor"),
            fetch("http://localhost:8080/aulas"),
          ]);

        const classesData = await classesRes.json();
        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();
        const lessonsData = await lessonsRes.json();

        setClasses(classesData);
        setStudents(studentsData);
        setTeachers(teachersData);
        setLessons(lessonsData);
      } catch (err) {
        setError("Erro ao carregar dados iniciais");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Manipuladores de formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeacherInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassInputChange = (e) => {
    const { name, value } = e.target;
    setClassForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnrollmentChange = (e) => {
    const { name, value } = e.target;
    setEnrollment((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinguaChange = (lingua) => {
    setTeacherForm((prev) => {
      const newLinguas = prev.linguas.includes(lingua)
        ? prev.linguas.filter((l) => l !== lingua)
        : [...prev.linguas, lingua];
      return { ...prev, linguas: newLinguas };
    });
  };

  // Submissão de formulários
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/aluno/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar aluno");
      }

      const newStudent = await response.json();
      setStudents([...students, newStudent]);
      setSuccess("Aluno cadastrado com sucesso!");
      setStudentForm({
        nome: "",
        email: "",
        senha: "123456",
        telefone: "",
        endereco: "",
        matricula: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/professor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar professor");
      }

      const newTeacher = await response.json();
      setTeachers([...teachers, newTeacher]);
      setSuccess("Professor cadastrado com sucesso!");
      setTeacherForm({
        nome: "",
        email: "",
        senha: "123456",
        telefone: "",
        endereco: "",
        matricula: "",
        valorHora: "",
        linguas: [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/turma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar turma");
      }

      const newClass = await response.json();
      setClasses([...classes, newClass]);
      setSuccess("Turma criada com sucesso!");
      setClassForm({
        lingua: "INGLES",
        nivel: "INICIANTE",
        dataInicio: "",
        dataTermino: "",
        professorId: "",
        preco: "",
        valorArrecadado: 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8080/turma/${enrollment.turmaId}/matricular/${enrollment.alunoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao matricular aluno");
      }

      setSuccess("Aluno matriculado com sucesso!");
      setEnrollment({
        turmaId: "",
        alunoId: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/aulas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar aula");
      }

      const newLesson = await response.json();
      setLessons([...lessons, newLesson]);
      setSuccess("Aula criada com sucesso!");
      setLessonForm({
        turmaId: "",
        data: "",
        horaInicio: "",
        horaFim: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <h2>Painel do Funcionário</h2>
      <p>Gerenciamento do sistema de idiomas</p>

      <div className="mb-4">
        <button
          onClick={() => setView("registerStudent")}
          className={`btn ${
            view === "registerStudent" ? "btn-primary" : "btn-secondary"
          } mx-1`}
        >
          Cadastrar Aluno
        </button>
        <button
          onClick={() => setView("registerTeacher")}
          className={`btn ${
            view === "registerTeacher" ? "btn-primary" : "btn-secondary"
          } mx-1`}
        >
          Cadastrar Professor
        </button>
        <button
          onClick={() => setView("createClass")}
          className={`btn ${
            view === "createClass" ? "btn-primary" : "btn-secondary"
          } mx-1`}
        >
          Criar Turma
        </button>
        <button
          onClick={() => setView("enrollStudent")}
          className={`btn ${
            view === "enrollStudent" ? "btn-primary" : "btn-secondary"
          } mx-1`}
        >
          Matricular Aluno
        </button>
        <button
          onClick={() => setView("createLesson")}
          className={`btn ${
            view === "createLesson" ? "btn-primary" : "btn-secondary"
          } mx-1`}
        >
          Criar Aula
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            type="button"
            className="close"
            onClick={() => setError(null)}
          >
            <span>&times;</span>
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
          <button
            type="button"
            className="close"
            onClick={() => setSuccess(null)}
          >
            <span>&times;</span>
          </button>
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {view === "registerStudent" && (
        <div>
          <h3>Cadastrar Novo Aluno</h3>
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group">
              <label>Nome Completo:</label>
              <input
                type="text"
                name="nome"
                value={studentForm.nome}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={studentForm.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Senha:</label>
              <input
                type="password"
                name="senha"
                value={studentForm.senha}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone:</label>
              <input
                type="text"
                name="telefone"
                value={studentForm.telefone}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={studentForm.endereco}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Matrícula:</label>
              <input
                type="text"
                name="matricula"
                value={studentForm.matricula}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Aluno"}
            </button>
          </form>
        </div>
      )}

      {view === "registerTeacher" && (
        <div>
          <h3>Cadastrar Novo Professor</h3>
          <form onSubmit={handleTeacherSubmit}>
            <div className="form-group">
              <label>Nome Completo:</label>
              <input
                type="text"
                name="nome"
                value={teacherForm.nome}
                onChange={handleTeacherInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={teacherForm.email}
                onChange={handleTeacherInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Senha:</label>
              <input
                type="password"
                name="senha"
                value={teacherForm.senha}
                onChange={handleTeacherInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone:</label>
              <input
                type="text"
                name="telefone"
                value={teacherForm.telefone}
                onChange={handleTeacherInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={teacherForm.endereco}
                onChange={handleTeacherInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Matrícula:</label>
              <input
                type="text"
                name="matricula"
                value={teacherForm.matricula}
                onChange={handleTeacherInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Valor por Hora:</label>
              <input
                type="number"
                name="valorHora"
                value={teacherForm.valorHora}
                onChange={handleTeacherInputChange}
                className="form-control"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Línguas que ensina:</label>
              <div>
                {linguasOptions.map((lingua) => (
                  <div key={lingua} className="form-check">
                    <input
                      type="checkbox"
                      id={`lingua-${lingua}`}
                      checked={teacherForm.linguas.includes(lingua)}
                      onChange={() => handleLinguaChange(lingua)}
                      className="form-check-input"
                    />
                    <label
                      htmlFor={`lingua-${lingua}`}
                      className="form-check-label"
                    >
                      {lingua.charAt(0) + lingua.slice(1).toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Professor"}
            </button>
          </form>
        </div>
      )}

      {view === "createClass" && (
        <div>
          <h3>Criar Nova Turma</h3>
          <form onSubmit={handleClassSubmit}>
            <div className="form-group">
              <label>Língua:</label>
              <select
                name="lingua"
                value={classForm.lingua}
                onChange={handleClassInputChange}
                className="form-control"
                required
              >
                {linguasOptions.map((lingua) => (
                  <option key={lingua} value={lingua}>
                    {lingua.charAt(0) + lingua.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Nível:</label>
              <select
                name="nivel"
                value={classForm.nivel}
                onChange={handleClassInputChange}
                className="form-control"
                required
              >
                {nivelOptions.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel.charAt(0) + nivel.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data de Início:</label>
              <input
                type="date"
                name="dataInicio"
                value={classForm.dataInicio}
                onChange={handleClassInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Término:</label>
              <input
                type="date"
                name="dataTermino"
                value={classForm.dataTermino}
                onChange={handleClassInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Professor:</label>
              <select
                name="professorId"
                value={classForm.professorId}
                onChange={handleClassInputChange}
                className="form-control"
                required
              >
                <option value="">Selecione um professor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Preço:</label>
              <input
                type="number"
                name="preco"
                value={classForm.preco}
                onChange={handleClassInputChange}
                className="form-control"
                step="0.01"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Turma"}
            </button>
          </form>
        </div>
      )}

      {view === "enrollStudent" && (
        <div>
          <h3>Matricular Aluno em Turma</h3>
          <form onSubmit={handleEnrollmentSubmit}>
            <div className="form-group">
              <label>Turma:</label>
              <select
                name="turmaId"
                value={enrollment.turmaId}
                onChange={handleEnrollmentChange}
                className="form-control"
                required
              >
                <option value="">Selecione uma turma</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.lingua} - {cls.nivel} (Início:{" "}
                    {new Date(cls.dataInicio).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Aluno:</label>
              <select
                name="alunoId"
                value={enrollment.alunoId}
                onChange={handleEnrollmentChange}
                className="form-control"
                required
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.nome}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Matriculando..." : "Matricular Aluno"}
            </button>
          </form>
        </div>
      )}

      {view === "createLesson" && (
        <div>
          <h3>Criar Nova Aula</h3>
          <form onSubmit={handleLessonSubmit}>
            <div className="form-group">
              <label>Turma:</label>
              <select
                name="turmaId"
                value={lessonForm.turmaId}
                onChange={handleLessonChange}
                className="form-control"
                required
              >
                <option value="">Selecione uma turma</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.lingua} - {cls.nivel} (Professor:{" "}
                    {cls.professor?.nome || "Definido"})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data:</label>
              <input
                type="date"
                name="data"
                value={lessonForm.data}
                onChange={handleLessonChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Hora de Início:</label>
              <input
                type="time"
                name="horaInicio"
                value={lessonForm.horaInicio}
                onChange={handleLessonChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Hora de Término:</label>
              <input
                type="time"
                name="horaFim"
                value={lessonForm.horaFim}
                onChange={handleLessonChange}
                className="form-control"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Aula"}
            </button>
          </form>

          {lessons.length > 0 && (
            <div className="mt-4">
              <h4>Aulas Cadastradas</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Turma</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Professor</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => {
                    const turma = classes.find((c) => c.id === lesson.turmaId);
                    return (
                      <tr key={lesson.id}>
                        <td>
                          {turma
                            ? `${turma.lingua} - ${turma.nivel}`
                            : "Turma não encontrada"}
                        </td>
                        <td>{new Date(lesson.data).toLocaleDateString()}</td>
                        <td>
                          {lesson.horaInicio} - {lesson.horaFim}
                        </td>
                        <td>{turma?.professor?.nome || "Definido"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardFuncionario;
