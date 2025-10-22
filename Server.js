// Import required modules
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'student'
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});


// ------------------------ ROUTES ------------------------

// CREATE - Add new user
app.post('/users', (req, res) => {
  const { first_name, last_name, email, phone, gender, age, course } = req.body;
  const sql = `
    INSERT INTO users (first_name, last_name, email, phone, gender, age, course)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [first_name, last_name, email, phone, gender, age, course], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error adding user.');
    }
    res.send('User added successfully.');
  });
});

// READ - Get all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error retrieving users.');
    }
    res.json(results);
  });
});

// READ - Get a single user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Error retrieving user.');
    }
    if (results.length === 0) return res.status(404).send('User not found.');
    res.json(results[0]);
  });
});

// UPDATE - Update user details
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, gender, age, course } = req.body;
  const sql = `
    UPDATE users 
    SET first_name = ?, last_name = ?, email = ?, phone = ?, gender = ?, age = ?, course = ?
    WHERE id = ?
  `;
  db.query(sql, [first_name, last_name, email, phone, gender, age, course, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).send('Error updating user.');
    }
    if (result.affectedRows === 0) return res.status(404).send('User not found.');
    res.send('User updated successfully.');
  });
});

// DELETE - Remove user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Error deleting user.');
    }
    if (result.affectedRows === 0) return res.status(404).send('User not found.');
    res.send('User deleted successfully.');
  });
});

// ------------------------ SERVER ------------------------
// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });