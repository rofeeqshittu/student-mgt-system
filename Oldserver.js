const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const mysql = require('mysql2');


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

// Handle form submissions
app.post('/add-student', (req, res) => {
    console.log('Student data:', req.body); // Log received data
    res.send('Student added successfully!');
});

app.post('/add-course', (req, res) => {
    console.log('Course data:', req.body); // Log received data
    res.send('Course added successfully!');
});

app.post('/add-skill', (req, res) => {
    console.log('Skill data:', req.body); // Log received data
    res.send('Skill added successfully!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


// Database

const connection = mysql.createConnection({
  host: 'localhost', // Change this to your DB host if using a remote database
  user: 'root', // Your MySQL username
  password: 'Rofade;, // Your MySQL password
  database: 'student_system' // Your MySQL database name
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

module.exports = connection; // To reuse the connection across your app

