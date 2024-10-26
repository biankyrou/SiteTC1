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

        <input 
          type="text"
          name="name"
          placeholder="Nome"
          className="register-input"
          value={values.name || ''}
          onChange={handleChangeValues}
        />
        <input 
          type="text"
          name="gender"
          placeholder="Gênero"
          className="register-input"
          value={values.gender || ''}
          onChange={handleChangeValues}
        />
        <input 
          type="text"
          name="occupation"
          placeholder="Ocupação"
          className="register-input"
          value={values.occupation || ''}
          onChange={handleChangeValues}
        />
        <input 
          type="text"
          name="nivel"
          placeholder="Nível de Devoção"
          className="register-input"
          value={values.nivel || ''}
          onChange={handleChangeValues}
        />
        <button 
          className="register-button" 
          onClick={handleClickButton}
        >
          {editingId ? "Atualizar no Culto" : "Inserir no Culto"}
        </button>
      </div>

      <div className="followers-container">
        <h2>Lista de Seguidores:</h2>
        <ul>
          {followers.map((follower) => (
            <li key={follower.id}>
              <strong>Nome:</strong> {follower.name} | 
              <strong> Gênero:</strong> {follower.gender} | 
              <strong> Ocupação:</strong> {follower.occupation} | 
              <strong> Nível:</strong> {follower.nivel} 
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
