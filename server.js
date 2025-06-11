const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./data.db');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/submit', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).send('Missing fields');
  const stmt = db.prepare("INSERT INTO submissions (email, code) VALUES (?, ?)");
  stmt.run(email, code, function(err) {
    if (err) return res.status(500).send('Database error');
    res.status(200).send('Success');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
