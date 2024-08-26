const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'mydatabase'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`);

// CRUD operations
// Create
app.post('/items', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO items (name) VALUES (?)', [name], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, name });
  });
});

// Read
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.query('UPDATE items SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) throw err;
    res.status(200).json({ id, name });
  });
});

// Delete
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.status(204).send();
  });
});

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
