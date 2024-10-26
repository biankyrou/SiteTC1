const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const readDatabase = () => {
  const data = fs.readFileSync('database.json');
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync('database.json', JSON.stringify(data, null, 2));
};

app.get('/followers', (req, res) => {
  const db = readDatabase();
  res.json(db.followers);
});

app.post('/followers', (req, res) => {
  const { name, gender, occupation, nivel } = req.body;

  const db = readDatabase();
  const nextId = db.followers.length > 0 
    ? Math.max(...db.followers.map(follower => Number(follower.id))) + 1 
    : 1;

  const newFollower = {
    id: nextId.toString(),
    name,
    gender,
    occupation,
    nivel
  };

  db.followers.push(newFollower);
  writeDatabase(db);
  res.status(200).send(`Follower inserido: ${JSON.stringify(newFollower)}`);
});


app.put('/followers/:id', (req, res) => {
  const { id } = req.params;
  const updatedFollower = req.body;

  const db = readDatabase();
  const followerIndex = db.followers.findIndex(follower => follower.id === id);

  if (followerIndex !== -1) {
    db.followers[followerIndex] = { ...db.followers[followerIndex], ...updatedFollower };
    writeDatabase(db);
    res.status(200).send(`Follower atualizado: ${JSON.stringify(db.followers[followerIndex])}`);
  } else {
    res.status(404).send('Follower não encontrado');
  }
});


app.delete('/followers/:id', (req, res) => {
  const { id } = req.params; 
  const db = readDatabase();
  
  
  const updatedFollowers = db.followers.filter(follower => follower.id !== id);
  

  if (updatedFollowers.length === db.followers.length) {
    return res.status(404).send('Follower não encontrado');
  }

  db.followers = updatedFollowers;
  writeDatabase(db);
  
  res.status(200).send(`Follower com ID ${id} excluído.`);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
