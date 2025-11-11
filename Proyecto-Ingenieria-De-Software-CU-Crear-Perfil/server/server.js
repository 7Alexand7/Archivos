const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, '../src/assets/data/users.json');

app.use(cors());
app.use(express.json());

// Obtener todos los usuarios
app.get('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer usuarios' });
  }
});

// Crear nuevo usuario
app.post('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    
    const newUser = req.body;
    users.push(newUser);
    
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
