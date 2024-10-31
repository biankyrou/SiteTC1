import React, { useState, useEffect } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const [values, setValues] = useState({});
  const [followers, setFollowers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChangeValues = (value) => {
    setValues((prevValue) => ({
      ...prevValue,
      [value.target.name]: value.target.value,
    }));
  };

  const handleClickButton = () => {
    if (editingId) {
      axios.put(`http://localhost:3001/followers/${editingId}`, values)
        .then(() => {
          console.log("Follower atualizado:", values);
          setEditingId(null);
          setValues({});
          getFollowers();
        })
        .catch((error) => console.error("Erro ao atualizar follower:", error));
    } else {
      axios.post('http://localhost:3001/followers', values)
        .then(() => {
          console.log("Follower inserido:", values);
          setValues({});
          getFollowers();
        })
        .catch((error) => console.error("Erro ao inserir follower:", error));
    }
  };

  const getFollowers = () => {
    axios.get('http://localhost:3001/followers')
      .then((response) => setFollowers(response.data))
      .catch((error) => console.error("Erro ao buscar followers:", error));
  };

  useEffect(() => {
    getFollowers();
  }, []);

  const handleEdit = (follower) => {
    setValues(follower);
    setEditingId(follower.id);
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
    <div className="app-container">
      <div className="register-container">
        <h1 className="register-title">Lamb Followers</h1>

        <div className="input-group">
          <p>Nome:</p>
          <input
            type="text"
            name="name"
            placeholder="Digite o nome do seguidor"
            className="register-input"
            value={values.name || ''}
            onChange={handleChangeValues}
          />
       </div>

      <div className="input-group">
        <p>Gênero:</p>
        <input
          type="text"
          name="gender"
          placeholder="Digite o gênero do seguidor"
          className="register-input"
          value={values.gender || ''}
          onChange={handleChangeValues}
        />
      </div>

      <div className="input-group">
          <p>Nivel de devoção:</p>
          <input
            type="number"
            name="nivel"
            placeholder="Nível de Devoção"
            className="register-input"
            value={values.nivel || ''}
            onChange={handleChangeValues}
          />
        </div>

        <div className="radio-group">
          <p>Ocupação:</p>
          <label>
            <input
              type="radio"
              name="occupation"
              value="Coletar"
              checked={values.occupation === "Coletar"}
              onChange={handleChangeValues}
            />Coletar
          </label>
          <label>
            <input
              type="radio"
              name="occupation"
              value="Construir"
              checked={values.occupation === "Construir"}
              onChange={handleChangeValues}
            /> Construir
          </label>
          <label>
            <input
              type="radio"
              name="occupation"
              value="Explorar"
              checked={values.occupation === "Explorar"}
              onChange={handleChangeValues}
            /> Explorar
          </label>
          <label>
            <input
              type="radio"
              name="occupation"
              value="Orar"
              checked={values.occupation === "Orar"}
              onChange={handleChangeValues}
            /> Orar
          </label>
        </div>

        
        <div className="radio-group">
          <p>Alinhamento com o Culto:</p>
          <label>
            <input
              type="radio"
              name="alignment"
              value="Leal"
              checked={values.alignment === "Leal"}
              onChange={handleChangeValues}
            /> Leal
          </label>
          <label>
            <input
              type="radio"
              name="alignment"
              value="Neutro"
              checked={values.alignment === "Neutro"}
              onChange={handleChangeValues}
            /> Neutro
          </label>
          <label>
            <input
              type="radio"
              name="alignment"
              value="Rebelde"
              checked={values.alignment === "Rebelde"}
              onChange={handleChangeValues}
            /> Rebelde
          </label>
        </div>

        <button
          className="register-button"
          onClick={handleClickButton}
        >
          {editingId ? "Atualizar Seguidor" : "Participar do Culto"}
        </button>
      </div>

      <div className="followers-container">
        <h2>Lista de Seguidores:</h2>
        <ul>
          {followers.map((follower) => (
            <li key={follower.id}>
              <strong>Nome:</strong> {follower.name} |
              <strong> Gênero:</strong> {follower.gender} |
              <strong> Profissão:</strong> {follower.occupation} |
              <strong> Nível:</strong> {follower.nivel} |
              <strong> Alinhamento:</strong> {follower.alignment}
              <button className="edit-button" onClick={() => handleEdit(follower)}>Editar</button>
              <button className="delete-button" onClick={() => handleDelete(follower.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
