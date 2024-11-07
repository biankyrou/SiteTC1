import React, { useState, useEffect } from "react";
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Card from './components/Card/index.js'
import Slider from 'react-slick';


const ImageSlider = ({ images, onSelectImage }) => {
  return (
    <Slider
      dots={true}           // Adiciona as bolinhas para navegação
      infinite={true}       // Permite rotação infinita
      speed={500}           // Velocidade da transição entre as imagens
      slidesToShow={3}      // Exibe 3 imagens por vez
      slidesToScroll={1}    // Avança uma imagem por vez
      centerMode={true}     // Exibe a imagem centralizada
      focusOnSelect={true}  // Foca na imagem ao clicar
      className="image-slider"
    >
      {images.map((image, index) => (
        <div key={index} className="slider-item">
          <img
            src={image}
            alt={`Follower ${index}`}
            onClick={() => onSelectImage(image)}
            className="slider-image"
          />
        </div>
      ))}
    </Slider>
  );
};

function Register({ selectedFollower, onSave }) {
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const images = [
    '/img/Hippo_form.webp',  
    '/img/Bison_form.webp',
    '/img/Capybara_form_3.webp',
    '/img/Frog_form.webp',
    '/img/Fox_form.webp',
    '/img/Elephant_form_2.webp',
    '/img/Cat_form_2.webp',
    '/img/Fennecfox_form_2.png',
    '/img/Starfish_form_2.webp',
    '/img/Nightwolf_form_2.webp',
    '/img/Twitchcat_form_2.webp',
    '/img/Tapir_form_2.webp',
    '/img/Redpanda_form.webp',
    '/img/Turtle_form.webp',

  ];


  useEffect(() => {
    if (selectedFollower) {
      setValues(selectedFollower);
    } else {
      setValues({});
    }
  }, [selectedFollower]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); 
      return () => clearTimeout(timer);
    }
  }, [message]);
  

  const handleChangeValues = (event) => {
    setValues((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClickButton = () => {
    setLoading(true);
    const request = selectedFollower
      ? axios.put(`http://localhost:3001/followers/${selectedFollower.id}`, values)
      : axios.post('http://localhost:3001/followers', values);
  
    request.then(() => {
      setMessage(selectedFollower ? "Seguidor atualizado com sucesso!" : "Seguidor inserido com sucesso!");
      onSave();
      setValues({});
      navigate('/followers');
    }).catch((error) => {
      setMessage("Erro ao salvar seguidor.");
      console.error("Erro ao salvar follower:", error);
    }).finally(() => {
      setLoading(false); 
    });
  };
  
  const handleSelectImage = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Join the Cult</h1>

      {message && <div role="alert">{message}</div>}
      {loading && <div className="spinner">Loading...</div>}


      
      <div className="input-group">
        <p>Nome:</p>
        <input type="text" name="name" placeholder="Um nome misterioso ou peculiar para o seguidor." className="register-input" value={values.name || ''} onChange={handleChangeValues} />
      </div>

      <div className="input-group">
        <p>Gênero:</p>
        <input type="text" name="gender" placeholder="Pode ser 'Masculino', 'Feminino', ou até algo místico como 'Inominado'." className="register-input" value={values.gender || ''} onChange={handleChangeValues} />
      </div>

      <div className="input-group">
        <p>Nível de devoção:</p>
        <input type="number" name="nivel" placeholder="Representa o quanto o seguidor é dedicado ao culto." className="register-input" value={values.nivel || ''} onChange={handleChangeValues} />
      </div>

      <div className="radio-group">
        <p>Ocupação:</p>
        <label><input type="radio" name="occupation" value="Coletar" checked={values.occupation === "Coletar"} onChange={handleChangeValues} /> Coletar</label>
        <label><input type="radio" name="occupation" value="Construir" checked={values.occupation === "Construir"} onChange={handleChangeValues} /> Construir</label>
        <label><input type="radio" name="occupation" value="Explorar" checked={values.occupation === "Explorar"} onChange={handleChangeValues} /> Explorar</label>
        <label><input type="radio" name="occupation" value="Orar" checked={values.occupation === "Orar"} onChange={handleChangeValues} /> Orar</label>
      </div>

      <label>Escolha uma Forma de Seguidor:</label>
      <ImageSlider images={images} onSelectImage={handleSelectImage} />

      <p>Forma Selecionada:</p>
      <div className="register-form">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Imagem Selecionada"
            className="selected-image"
          />
        )}

        <button className="register-button" onClick={handleClickButton}>
          {selectedFollower ? "Atualizar Seguidor" : "Participar do Culto"}
        </button>
      </div>
    </div>
  );
}

function FollowersList({ onEdit }) {
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate(); 
  const [message, setMessage] = useState('');

  const getFollowers = () => {
    axios.get('http://localhost:3001/followers')
      .then((response) => setFollowers(response.data))
      .catch((error) => console.error("Erro ao buscar followers:", error));
  };

  useEffect(() => {
    getFollowers();
  }, []);

const handleEdit = (follower) => {
    onEdit(follower); 
    navigate('/'); 
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/followers/${id}`)
      .then(() => {
        setMessage("Seguidor excluído com sucesso!"); 
        getFollowers(); 
      })
      .catch((error) => {
        setMessage("Erro ao excluir seguidor."); 
        console.error("Erro ao excluir follower:", error);
      });
  };

  
  
  
  return (
    <div className="followers-container">
      <h2>Lista de Seguidores:</h2>

      {/* Exibe a mensagem para o usuário */}
      {message && <p>{message}</p>}

      {/* <ul>
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
      </ul> */}

      <div className="followers-list">
        {followers.map((follower) => (
          <div key={follower.id}>
            <Card follower={follower} onSchedule={() => handleEdit(follower)} />
            <button className="edit-button" onClick={() => handleEdit(follower)}>Editar</button>
            <button className="delete-button" onClick={() => handleDelete(follower.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}


function App() {
  const [selectedFollower, setSelectedFollower] = useState(null);

  const handleEditFollower = (follower) => {
    setSelectedFollower(follower); 
  };

  const handleSaveFollower = () => {
    setSelectedFollower(null); 
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Register selectedFollower={selectedFollower} onSave={handleSaveFollower} />} />
          <Route path="/followers" 
          element={<FollowersList 
          onEdit={handleEditFollower} />} />

        </Routes>
        <nav className="nav-container">
          <Link to="/">Página Principal</Link> | <Link to="/followers">Lista de Seguidores</Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
