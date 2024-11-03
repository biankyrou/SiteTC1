import React, { useState, useEffect } from "react";
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function Register() {
  const [values, setValues] = useState({});
  const [editingId, setEditingId] = useState(null);

  const handleChangeValues = (value) => {
    setValues((prevValue) => ({
      ...prevValue,
      [value.target.name]: value.target.value,
    }));
  };

  const handleClickButton = () => {
    const request = editingId 
      ? axios.put(`http://localhost:3001/followers/${editingId}`, values)
      : axios.post('http://localhost:3001/followers', values);
    
    request.then(() => {
      console.log(editingId ? "Follower atualizado:" : "Follower inserido:", values);
      setEditingId(null);
      setValues({});
    }).catch((error) => console.error("Erro ao salvar follower:", error));
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Lamb Followers</h1>

      <div className="input-group">
        <p>Nome:</p>
        <input type="text" name="name" placeholder="Digite o nome do seguidor" className="register-input" value={values.name || ''} onChange={handleChangeValues} />
      </div>

      <div className="input-group">
        <p>Gênero:</p>
        <input type="text" name="gender" placeholder="Digite o gênero do seguidor" className="register-input" value={values.gender || ''} onChange={handleChangeValues} />
      </div>

      <div className="input-group">
        <p>Nivel de devoção:</p>
        <input type="number" name="nivel" placeholder="Nível de Devoção" className="register-input" value={values.nivel || ''} onChange={handleChangeValues} />
      </div>

      <div className="radio-group">
        <p>Ocupação:</p>
        <label><input type="radio" name="occupation" value="Coletar" checked={values.occupation === "Coletar"} onChange={handleChangeValues} /> Coletar</label>
        <label><input type="radio" name="occupation" value="Construir" checked={values.occupation === "Construir"} onChange={handleChangeValues} /> Construir</label>
        <label><input type="radio" name="occupation" value="Explorar" checked={values.occupation === "Explorar"} onChange={handleChangeValues} /> Explorar</label>
        <label><input type="radio" name="occupation" value="Orar" checked={values.occupation === "Orar"} onChange={handleChangeValues} /> Orar</label>
      </div>

      <button className="register-button" onClick={handleClickButton}>
        {editingId ? "Atualizar Seguidor" : "Participar do Culto"}
      </button>
    </div>
  );
}

function FollowersList() {
  const [followers, setFollowers] = useState([]);

  const getFollowers = () => {
    axios.get('http://localhost:3001/followers')
      .then((response) => setFollowers(response.data))
      .catch((error) => console.error("Erro ao buscar followers:", error));
  };

  useEffect(() => {
    getFollowers();
  }, []);

  const handleEdit = (follower) => {
    // Implementar lógica de edição se necessário
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/followers/${id}`)
      .then(() => {
        console.log("Follower excluído:", id);
        getFollowers();
      })
      .catch((error) => console.error("Erro ao excluir follower:", error));
  };

  return (
    <div className="followers-container">
      <h2>Lista de Seguidores:</h2>
      <ul>
        {followers.map((follower) => (
          <li key={follower.id}>
            <strong>Nome:</strong> {follower.name} |
            <strong> Gênero:</strong> {follower.gender} |
            <strong> Profissão:</strong> {follower.occupation} |
            <strong> Nível:</strong> {follower.nivel}
            <button className="edit-button" onClick={() => handleEdit(follower)}>Editar</button>
            <button className="delete-button" onClick={() => handleDelete(follower.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/followers" element={<FollowersList />} />
        </Routes>
        <nav className="nav-container">
          <Link to="/">Página Principal</Link> | <Link to="/followers">Lista de Seguidores</Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
