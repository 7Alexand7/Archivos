const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, '../src/assets/data/users.json');
const QUIZZES_FILE = path.join(__dirname, '../src/assets/data/quizzes.json');

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

// ============= QUIZZES ENDPOINTS =============

// Obtener todos los quizzes
app.get('/api/quizzes', (req, res) => {
  try {
    if (!fs.existsSync(QUIZZES_FILE)) {
      fs.writeFileSync(QUIZZES_FILE, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(QUIZZES_FILE, 'utf8');
    const quizzes = JSON.parse(data);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer quizzes' });
  }
});

// Crear nuevo quiz
app.post('/api/quizzes', (req, res) => {
  try {
    if (!fs.existsSync(QUIZZES_FILE)) {
      fs.writeFileSync(QUIZZES_FILE, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(QUIZZES_FILE, 'utf8');
    const quizzes = JSON.parse(data);
    
    const newQuiz = {
      ...req.body,
      id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1
    };
    
    quizzes.push(newQuiz);
    fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear quiz' });
  }
});

// Obtener quiz por ID
app.get('/api/quizzes/:id', (req, res) => {
  try {
    const data = fs.readFileSync(QUIZZES_FILE, 'utf8');
    const quizzes = JSON.parse(data);
    const quiz = quizzes.find(q => q.id === parseInt(req.params.id));
    
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ error: 'Quiz no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer quiz' });
  }
});

// Actualizar quiz
app.put('/api/quizzes/:id', (req, res) => {
  try {
    const data = fs.readFileSync(QUIZZES_FILE, 'utf8');
    const quizzes = JSON.parse(data);
    const index = quizzes.findIndex(q => q.id === parseInt(req.params.id));
    
    if (index !== -1) {
      quizzes[index] = { ...quizzes[index], ...req.body, id: parseInt(req.params.id) };
      fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
      res.json(quizzes[index]);
    } else {
      res.status(404).json({ error: 'Quiz no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar quiz' });
  }
});

// Eliminar quiz
app.delete('/api/quizzes/:id', (req, res) => {
  try {
    const data = fs.readFileSync(QUIZZES_FILE, 'utf8');
    const quizzes = JSON.parse(data);
    const filtered = quizzes.filter(q => q.id !== parseInt(req.params.id));
    
    if (filtered.length < quizzes.length) {
      fs.writeFileSync(QUIZZES_FILE, JSON.stringify(filtered, null, 2));
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Quiz no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar quiz' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
