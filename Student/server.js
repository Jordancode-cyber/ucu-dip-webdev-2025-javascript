// ======================================================
// Lecture 05: Advanced CRUD Operations and Error Handling
// ======================================================
// server.js (at the very top)
require('dotenv').config(); 

const express = require('express');

// Import required modules
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware
app.use(express.json());

// ------------------------------------------------------
// DATABASE CONNECTION
// ------------------------------------------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // change this to your MySQL password
  database: process.env.DB_NAME  // use your existing database
});

// Test the connection
connection.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connection successful!');
    }
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error;
  } else {
    console.log;
  }
});

// ------------------------------------------------------
// ROUTES: CRUD OPERATIONS
// ------------------------------------------------------

/**
 * CREATE - Add a new user
 * Method: POST
 * Endpoint: /users
 */
app.post('/users', (req, res) => {
  const { first_name, last_name, email, phone, gender, age, course } = req.body;

  // Input validation
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required.' });
  }

  const sql = `
    INSERT INTO users (first_name, last_name, email, phone, gender, age, course)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  //  Execute query
  db.query(sql, [first_name, last_name, email, phone, gender, age, course], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);

      // Handle duplicate entry
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already exists.' });
      }

      return res.status(500).json({ error: 'Database error while adding user.' });
    }

    res.status(201).json({
      message: 'User added successfully.',
      user_id: result.insertId
    });
  });
});

/**
 * READ - Get all users
 * Method: GET
 * Endpoint: /users
 */
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users ORDER BY id DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error while retrieving users.' });
    }

    res.status(200).json(results);
  });
});

/**
 * READ - Get single user by ID
 * Method: GET
 * Endpoint: /users/:id
 */
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database error while retrieving user.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(results[0]);
  });
});

/**
 * UPDATE - Update user details
 * Method: PUT
 * Endpoint: /users/:id
 */
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, gender, age, course } = req.body;

  // Input validation
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required.' });
  }

  const sql = `
    UPDATE users
    SET first_name = ?, last_name = ?, email = ?, phone = ?, gender = ?, age = ?, course = ?
    WHERE id = ?
  `;

  db.query(sql, [first_name, last_name, email, phone, gender, age, course, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Database error while updating user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated successfully.' });
  });
});

/**
 * DELETE - Remove user by ID
 * Method: DELETE
 * Endpoint: /users/:id
 */
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Database error while deleting user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  });
});

// ------------------------------------------------------
// Search by course
// ------------------------------------------------------
app.get('/users/course/:course', (req, res) => {
  const { course } = req.params;
  const sql = 'SELECT * FROM users WHERE course = ?';

  db.query(sql, [course], (err, results) => {
    if (err) {
      console.error('Error searching by course:', err);
      return res.status(500).json({ error: 'Database error during course search.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No users found for this course.' });
    }

    res.status(200).json(results);
  });
});

// ------------------------------------------------------
// GLOBAL ERROR HANDLING MIDDLEWARE 
// ------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Unexpected server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

// ------------------------------------------------------
// SERVER START
// ------------------------------------------------------
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});