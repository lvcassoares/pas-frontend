import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const BASE_URL = "http://localhost:8080";

const DashboardCliente = () => {
  // Estados para gestão de gastos
  const [gastos, setGastos] = useState([]);
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    data: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Estados para relatórios e turmas
  const [relatorioMensal, setRelatorioMensal] = useState([]);
  const [gastosProfessores, setGastosProfessores] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [pagamentoData, setPagamentoData] = useState({
    turmaId: "",
    valor: "",
  });
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  );
  const [professorId, setProfessorId] = useState("");

  // Carregar dados iniciais
  useEffect(() => {
    fetchGastos();
    fetchTurmas();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/gastos`);
      setGastos(response.data);
    } catch (error) {
      console.error("Erro ao buscar gastos:", error);
    }
  };

  const fetchTurmas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/turma`);
      setTurmas(response.data);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  };

  // Carregar relatórios
  const fetchRelatorioMensal = async (ano) => {
    try {
      const response = await axios.get(`${BASE_URL}/relatorios/mensal/${ano}`);
      setRelatorioMensal(response.data);
    } catch (error) {
      console.error("Erro ao buscar relatório mensal:", error);
    }
  };

  const fetchGastosProfessores = async (professorId, mes, ano) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/professor/professores/${professorId}/gastos?mes=${mes}&ano=${ano}`
      );
      setGastosProfessores(response.data);
    } catch (error) {
      console.error("Erro ao buscar gastos do professor:", error);
    }
  };

  // Manipuladores de formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePagamentoInputChange = (e) => {
    const { name, value } = e.target;
    setPagamentoData({
      ...pagamentoData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/gastos/${editingId}`, formData);
      } else {
        await axios.post(`${BASE_URL}/gastos`, formData);
      }
      fetchGastos();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar gasto:", error);
    }
  };

  const handlePagamentoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/turma/${pagamentoData.turmaId}/pagamentos?valor=${pagamentoData.valor}`
      );
      alert("Pagamento registrado com sucesso!");
      fetchTurmas();
      setPagamentoData({
        turmaId: "",
        valor: "",
      });
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      alert("Erro ao registrar pagamento");
    }
  };

  const handleEdit = (gasto) => {
    setFormData({
      descricao: gasto.descricao,
      valor: gasto.valor,
      data: gasto.data.split("T")[0], // Formata a data para o input date
    });
    setEditingId(gasto.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/gastos/${id}`);
      fetchGastos();
    } catch (error) {
      console.error("Erro ao deletar gasto:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: "",
      valor: "",
      data: "",
    });
    setEditingId(null);
  };

  // Manipuladores de relatórios
  const handleGerarRelatorioMensal = () => {
    fetchRelatorioMensal(anoSelecionado);
  };

  const handleBuscarGastosProfessor = () => {
    if (professorId) {
      fetchGastosProfessores(professorId, mesSelecionado, anoSelecionado);
    }
  };

  return (
    <div className="container">
      <h2>Painel de Gestão Financeira</h2>

      {/* Seção de CRUD de Gastos */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>{editingId ? "Editar Gasto" : "Adicionar Novo Gasto"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Descrição:</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Valor:</label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              required
              step="0.01"
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Data:</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div>
            <button type="submit" style={{ marginRight: "1rem" }}>
              {editingId ? "Atualizar" : "Salvar"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Gastos */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Lista de Gastos</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                Descrição
              </th>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                Valor
              </th>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                Data
              </th>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  {gasto.descricao}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  R$ {gasto.valor.toFixed(2)}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  {new Date(gasto.data).toLocaleDateString()}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleEdit(gasto)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDelete(gasto.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seção de Turmas e Pagamentos */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Lista de Turmas */}
        <div className="card" style={{ flex: 2, minWidth: "300px" }}>
          <h3>Lista de Turmas</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  ID
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Língua/Nível
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Período
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Professor
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Valor Total
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Arrecadado
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Progresso
                </th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => (
                <tr key={turma.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {turma.id}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {turma.lingua} - {turma.nivel}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {new Date(turma.dataInicio).toLocaleDateString()} a{" "}
                    {new Date(turma.dataTermino).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {turma.professorNome}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    R$ {turma.preco.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    R$ {turma.valorArrecadado.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: `${
                            (turma.valorArrecadado / turma.preco) * 100
                          }%`,
                          backgroundColor: "#4CAF50",
                          height: "20px",
                          borderRadius: "5px",
                          textAlign: "center",
                          color: "white",
                          fontSize: "12px",
                          lineHeight: "20px",
                        }}
                      >
                        {Math.round(
                          (turma.valorArrecadado / turma.preco) * 100
                        )}
                        %
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulário de Pagamento */}
        <div className="card" style={{ flex: 1, minWidth: "300px" }}>
          <h3>Registrar Pagamento</h3>
          <form onSubmit={handlePagamentoSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label>Turma:</label>
              <select
                name="turmaId"
                value={pagamentoData.turmaId}
                onChange={handlePagamentoInputChange}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    Turma {turma.id} - {turma.lingua} (
                    {turma.valorArrecadado.toFixed(2)} /{" "}
                    {turma.preco.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Valor do Pagamento:</label>
              <input
                type="number"
                name="valor"
                value={pagamentoData.valor}
                onChange={handlePagamentoInputChange}
                required
                step="0.01"
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <button type="submit">Registrar Pagamento</button>
          </form>
        </div>
      </div>

      {/* Relatório Mensal */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Relatório Mensal</h3>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(e.target.value)}
            style={{ padding: "0.5rem" }}
          >
            {[2023, 2024, 2025, 2026].map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
          <button onClick={handleGerarRelatorioMensal}>Gerar Relatório</button>
        </div>
        {relatorioMensal.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Período
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Arrecadado
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Gasto Realizado
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Gasto Previsto
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody>
              {relatorioMensal.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {item.periodo}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    R$ {item.valorArrecadado.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    R$ {item.gastoRealizado.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    R$ {item.gastoPrevisto.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    R$ {item.saldo.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Gastos por Professor */}
      <div className="card">
        <h3>Gastos por Professor</h3>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label>ID do Professor:</label>
            <input
              type="text"
              value={professorId}
              onChange={(e) => setProfessorId(e.target.value)}
              style={{ padding: "0.5rem", marginLeft: "0.5rem" }}
            />
          </div>
          <div>
            <label>Mês:</label>
            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              style={{ padding: "0.5rem", marginLeft: "0.5rem" }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Ano:</label>
            <select
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              style={{ padding: "0.5rem", marginLeft: "0.5rem" }}
            >
              {[2023, 2024, 2025, 2026].map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleBuscarGastosProfessor}>Buscar</button>
        </div>
        {gastosProfessores.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Descrição
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Valor
                </th>
                <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {gastosProfessores.map((gasto, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {gasto.descricao}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    R$ {gasto.valor.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {new Date(gasto.data).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardCliente;
