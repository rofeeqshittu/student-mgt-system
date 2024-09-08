require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve index.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// MySQL Database connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

// Create: Add a new student
app.post('/add-student', (req, res) => {
  const { name, age, email } = req.body;
  const query = 'INSERT INTO students (name, age, email) VALUES (?, ?, ?)';
  connection.query(query, [name, age, email], (err, result) => {
    if (err) {
      console.error('Error inserting student:', err);
      return res.status(500).send('Error adding student');
    }
    res.send('Student added successfully!');
  });
});


// Create: Add a new course
app.post('/add-course', (req, res) => {
  const { course_name, description } = req.body;
  const query = 'INSERT INTO courses (course_name, description) VALUES (?, ?)';
  connection.query(query, [course_name, description], (err, result) => {
    if (err) {
      console.error('Error inserting course:', err);
      return res.status(500).send('Error adding course');
    }
    res.send('course added successfully!');
  });
});

// Create: Add a new skill
app.post('/add-skill', (req, res) => {
  const { skill_name, description } = req.body;
  
  // Validate the skill_name
  if (!skill_name) {
    return res.status(400).send('Skill name is required');
  }

  const query = 'INSERT INTO skills (skill_name, description) VALUES (?, ?)';
  connection.query(query, [skill_name, description], (err, result) => {
    if (err) {
      console.error('Error inserting skill:', err);
      return res.status(500).send('Error adding skill');
    }
    res.send('Skill added successfully!');
  });
});

// Read: Get all students
app.get('/students', (req, res) => {
  const query = 'SELECT * FROM students';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Read: Get all courses
app.get('/courses', (req, res) => {
  const query = 'SELECT * FROM courses';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Read: Get all skills
app.get('/skills', (req, res) => {
  const query = 'SELECT * FROM skills';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update: Edit student information
app.post('/update-student', (req, res) => {
  const { id, name, age, email } = req.body;
  const query = 'UPDATE students SET name = ?, age = ?, email = ? WHERE id = ?';
  connection.query(query, [name, age, email, id], (err, result) => {
    if (err) throw err;
    res.send('Student updated successfully!');
  });
});

// Update: Edit course information
app.post('/update-course', (req, res) => {
  const { id, course_name, description } = req.body;
  const query = 'UPDATE courses SET course_name = ?, description = ? WHERE id = ?';
  connection.query(query, [course_name, description, id], (err, result) => {
    if (err) throw err;
    res.send('Course updated successfully!');
  });
});

// Update: Edit skill information
app.post('/update-skill', (req, res) => {
  const { id, skill_name, description } = req.body;
  const query = 'UPDATE skills SET skill_name = ?, description = ? WHERE id = ?';
  connection.query(query, [skill_name, description, id], (err, result) => {
    if (err) throw err;
    res.send('Skill updated successfully!');
  });
});

// Delete: Remove student
app.post('/delete-student', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM students WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send('Student deleted successfully!');
  });
});

// Delete: Remove course
app.post('/delete-course', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM courses WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send('Course deleted successfully!');
  });
});

// Delete: Remove skill
app.post('/delete-skill', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM skills WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send('Skill deleted successfully!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = connection; // To reuse the connection across your app

