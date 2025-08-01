require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve index.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Load data from JSON file
let data = {};
try {
  const dataPath = path.join(__dirname, 'data', 'data.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  data = JSON.parse(jsonData);
  console.log('Data loaded from JSON file!');
} catch (err) {
  console.error('Error loading data:', err);
  data = { students: [], courses: [], skills: [] };
}

// Function to save data to JSON file
const saveData = () => {
  try {
    const dataPath = path.join(__dirname, 'data', 'data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4), 'utf8');
    console.log('Data saved to JSON file!');
  } catch (err) {
    console.error('Error saving data:', err);
  }
};

// Create: Add a new student
app.post('/add-student', (req, res) => {
  try {
    const { name, email, age, skills, course } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).send('Student name is required');
    }
    
    // Create new student object
    const newStudent = {
      id: data.students.length > 0 ? Math.max(...data.students.map(s => s.id)) + 1 : 1,
      name,
      email: email || '',
      age: age || null,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      courses: course ? course.split(',').map(c => c.trim()) : []
    };
    
    // Add to data
    data.students.push(newStudent);
    saveData();
    
    res.send('Student added successfully!');
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).send('Error adding student');
  }
});

// Create: Add a new course
app.post('/add-course', (req, res) => {
  try {
    const { course_name, description } = req.body;
    
    // Validate required fields
    if (!course_name) {
      return res.status(400).send('Course name is required');
    }
    
    // Create new course object
    const newCourse = {
      id: data.courses.length > 0 ? Math.max(...data.courses.map(c => c.id)) + 1 : 1,
      name: course_name,
      description: description || ''
    };
    
    // Add to data
    data.courses.push(newCourse);
    saveData();
    
    res.send('Course added successfully!');
  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).send('Error adding course');
  }
});

// Create: Add a new skill
app.post('/add-skill', (req, res) => {
  try {
    const { skill_name, description } = req.body;
    
    // Validate required fields
    if (!skill_name) {
      return res.status(400).send('Skill name is required');
    }
    
    // Create new skill object
    const newSkill = {
      id: data.skills.length > 0 ? Math.max(...data.skills.map(s => s.id)) + 1 : 1,
      name: skill_name,
      description: description || ''
    };
    
    // Add to data
    data.skills.push(newSkill);
    saveData();
    
    res.send('Skill added successfully!');
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).send('Error adding skill');
  }
});

// Read: Get all students
app.get('/students', (req, res) => {
  res.json(data.students);
});

// Read: Get all courses
app.get('/courses', (req, res) => {
  res.json(data.courses);
});

// Read: Get all skills
app.get('/skills', (req, res) => {
  res.json(data.skills);
});

// Update: Edit student information
app.post('/update-student', (req, res) => {
  try {
    const { id, name, age, email } = req.body;
    
    // Find student by id
    const studentIndex = data.students.findIndex(s => s.id === parseInt(id));
    if (studentIndex === -1) {
      return res.status(404).send('Student not found');
    }
    
    // Update student
    if (name) data.students[studentIndex].name = name;
    if (age) data.students[studentIndex].age = parseInt(age);
    if (email) data.students[studentIndex].email = email;
    
    saveData();
    res.send('Student updated successfully!');
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).send('Error updating student');
  }
});

// Update: Edit course information
app.post('/update-course', (req, res) => {
  try {
    const { id, course_name, description } = req.body;
    
    // Find course by id
    const courseIndex = data.courses.findIndex(c => c.id === parseInt(id));
    if (courseIndex === -1) {
      return res.status(404).send('Course not found');
    }
    
    // Update course
    if (course_name) data.courses[courseIndex].name = course_name;
    if (description) data.courses[courseIndex].description = description;
    
    saveData();
    res.send('Course updated successfully!');
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).send('Error updating course');
  }
});

// Update: Edit skill information
app.post('/update-skill', (req, res) => {
  try {
    const { id, skill_name, description } = req.body;
    
    // Find skill by id
    const skillIndex = data.skills.findIndex(s => s.id === parseInt(id));
    if (skillIndex === -1) {
      return res.status(404).send('Skill not found');
    }
    
    // Update skill
    if (skill_name) data.skills[skillIndex].name = skill_name;
    if (description) data.skills[skillIndex].description = description;
    
    saveData();
    res.send('Skill updated successfully!');
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).send('Error updating skill');
  }
});

// Delete: Remove student
app.post('/delete-student', (req, res) => {
  try {
    const { id } = req.body;
    
    // Find student by id
    const studentIndex = data.students.findIndex(s => s.id === parseInt(id));
    if (studentIndex === -1) {
      return res.status(404).send('Student not found');
    }
    
    // Remove student
    data.students.splice(studentIndex, 1);
    
    saveData();
    res.send('Student deleted successfully!');
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).send('Error deleting student');
  }
});

// Delete: Remove course
app.post('/delete-course', (req, res) => {
  try {
    const { id } = req.body;
    
    // Find course by id
    const courseIndex = data.courses.findIndex(c => c.id === parseInt(id));
    if (courseIndex === -1) {
      return res.status(404).send('Course not found');
    }
    
    // Remove course
    data.courses.splice(courseIndex, 1);
    
    saveData();
    res.send('Course deleted successfully!');
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).send('Error deleting course');
  }
});

// Delete: Remove skill
app.post('/delete-skill', (req, res) => {
  try {
    const { id } = req.body;
    
    // Find skill by id
    const skillIndex = data.skills.findIndex(s => s.id === parseInt(id));
    if (skillIndex === -1) {
      return res.status(404).send('Skill not found');
    }
    
    // Remove skill
    data.skills.splice(skillIndex, 1);
    
    saveData();
    res.send('Skill deleted successfully!');
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).send('Error deleting skill');
  }
});

// --- NEW API ENDPOINT FOR DATA PERSISTENCE ---
// Save entire data structure (used by enhanced frontend)
app.post('/api/save-data', (req, res) => {
  try {
    const newData = req.body;
    
    // Validate data structure
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    
    // Ensure required arrays exist
    if (!Array.isArray(newData.students)) newData.students = [];
    if (!Array.isArray(newData.courses)) newData.courses = [];
    if (!Array.isArray(newData.skills)) newData.skills = [];
    
    // Validate each student has required fields
    newData.students.forEach((student, index) => {
      if (!student.id || !student.name) {
        throw new Error(`Student at index ${index} missing required fields (id, name)`);
      }
    });
    
    // Validate each course has required fields
    newData.courses.forEach((course, index) => {
      if (!course.id || !course.name) {
        throw new Error(`Course at index ${index} missing required fields (id, name)`);
      }
    });
    
    // Validate each skill has required fields
    newData.skills.forEach((skill, index) => {
      if (!skill.id || !skill.name) {
        throw new Error(`Skill at index ${index} missing required fields (id, name)`);
      }
    });
    
    // Update global data object
    data = newData;
    
    // Save to JSON file
    saveData();
    
    console.log(`✅ Data persistence successful - Students: ${data.students.length}, Courses: ${data.courses.length}, Skills: ${data.skills.length}`);
    
    res.json({ 
      success: true, 
      message: 'Data saved successfully',
      counts: {
        students: data.students.length,
        courses: data.courses.length,
        skills: data.skills.length
      }
    });
  } catch (err) {
    console.error('❌ Error saving data:', err);
    res.status(500).json({ 
      error: 'Error saving data',
      details: err.message 
    });
  }
});

// Add error handling middleware at the end
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// This should be the last middleware to catch any errors
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
