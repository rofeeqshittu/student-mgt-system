document.addEventListener('DOMContentLoaded', () => {
    // Handle form submissions
    const studentForm = document.getElementById('student-form');
    const courseForm = document.getElementById('course-form');
    const skillForm = document.getElementById('skill-form');

    if (studentForm) studentForm.addEventListener('submit', handleStudentForm);
    if (courseForm) courseForm.addEventListener('submit', handleCourseForm);
    if (skillForm) skillForm.addEventListener('submit', handleSkillForm);

    // Initialize page-specific functionality
    initializePageFunctionality();

    // --- MOCK DATA ---
    const mockCourses = [
      { name: 'Mathematics', description: 'Basic Mathematics' },
      { name: 'Physics', description: 'Fundamentals of Physics' },
      { name: 'Chemistry', description: 'Introduction to Chemistry' },
      { name: 'Biology', description: 'Life Sciences' },
      { name: 'Computer Science', description: 'Programming and Algorithms' }
    ];

    const mockSkills = [
      { name: 'Programming', description: 'Ability to write code' },
      { name: 'Data Analysis', description: 'Analyzing and interpreting data' },
      { name: 'Public Speaking', description: 'Effective communication' },
      { name: 'Teamwork', description: 'Working well with others' },
      { name: 'Critical Thinking', description: 'Problem solving skills' }
    ];

    // --- MOCK DATA FOR STUDENTS ---
    const mockStudents = [
      { name: 'John Doe', courses: ['Math', 'Science'], skills: ['Programming', 'Data Analysis'] },
      { name: 'Jane Smith', courses: ['Biology'], skills: ['Teamwork', 'Critical Thinking'] },
      { name: 'Alice Johnson', courses: ['Computer Science', 'Math'], skills: ['Programming', 'Public Speaking'] },
      { name: 'Bob Lee', courses: ['Physics'], skills: ['Data Analysis', 'Teamwork'] },
      { name: 'Mary Green', courses: ['Chemistry', 'Biology'], skills: ['Critical Thinking'] }
    ];

    // --- DYNAMIC RENDERING FOR COURSES ---
    function renderCoursesTable(courses) {
      const container = document.getElementById('courses-list');
      if (!container) return;
      let html = `
        <div class="search-filter-bar">
          <div class="search-input">
            <input type="text" id="course-search" class="form-control" placeholder="Search courses...">
          </div>
          <div class="filter-select">
            <select id="course-sort" class="form-control">
              <option value="name">Sort by Name</option>
              <option value="description">Sort by Description</option>
            </select>
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${courses.map(course => `
                <tr>
                  <td><strong>${course.name}</strong></td>
                  <td>${course.description || 'No description provided'}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-secondary btn-sm" onclick="handleViewCourse(${course.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-primary btn-sm" onclick="handleEditCourse(${course.id})" title="Edit Course">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="handleDeleteCourse(${course.id})" title="Delete Course">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = html;

      // Add event listeners for search and sort
      document.getElementById('course-search').addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        const filtered = courses.filter(c => 
          c.name.toLowerCase().includes(value) || 
          (c.description && c.description.toLowerCase().includes(value))
        );
        renderCoursesTable(filtered);
      });
      document.getElementById('course-sort').addEventListener('change', function(e) {
        const sortBy = e.target.value;
        const sorted = [...courses].sort((a, b) => {
          const aVal = a[sortBy] || '';
          const bVal = b[sortBy] || '';
          return aVal.toString().localeCompare(bVal.toString());
        });
        renderCoursesTable(sorted);
      });
    }

    // --- DYNAMIC RENDERING FOR SKILLS ---
    function renderSkillsTable(skills) {
      const container = document.getElementById('skills-list');
      if (!container) return;
      let html = `
        <div class="search-filter-bar">
          <div class="search-input">
            <input type="text" id="skill-search" class="form-control" placeholder="Search skills...">
          </div>
          <div class="filter-select">
            <select id="skill-sort" class="form-control">
              <option value="name">Sort by Name</option>
              <option value="description">Sort by Description</option>
            </select>
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${skills.map(skill => `
                <tr>
                  <td><strong>${skill.name}</strong></td>
                  <td>${skill.description || 'No description provided'}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-secondary btn-sm" onclick="handleViewSkill(${skill.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-primary btn-sm" onclick="handleEditSkill(${skill.id})" title="Edit Skill">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="handleDeleteSkill(${skill.id})" title="Delete Skill">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = html;

      // Add event listeners for search and sort
      document.getElementById('skill-search').addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        const filtered = skills.filter(s => 
          s.name.toLowerCase().includes(value) || 
          (s.description && s.description.toLowerCase().includes(value))
        );
        renderSkillsTable(filtered);
      });
      document.getElementById('skill-sort').addEventListener('change', function(e) {
        const sortBy = e.target.value;
        const sorted = [...skills].sort((a, b) => {
          const aVal = a[sortBy] || '';
          const bVal = b[sortBy] || '';
          return aVal.toString().localeCompare(bVal.toString());
        });
        renderSkillsTable(sorted);
      });
    }

    // --- DYNAMIC RENDERING FOR STUDENTS ---
    function renderStudentsTable(students) {
      const containers = [
        document.getElementById('students-list'),
        document.getElementById('recent-students-list')
      ].filter(Boolean);
      if (containers.length === 0) return;
      let html = `
        <div class="search-filter-bar">
          <div class="search-input">
            <input type="text" id="student-search" class="form-control" placeholder="Search students...">
          </div>
          <div class="filter-select">
            <select id="student-sort" class="form-control">
              <option value="name">Sort by Name</option>
              <option value="courses">Sort by Courses</option>
              <option value="skills">Sort by Skills</option>
            </select>
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Courses</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(student => `
                <tr>
                  <td><strong>${student.name}</strong></td>
                  <td>${student.email || 'Not provided'}</td>
                  <td>${Array.isArray(student.courses) ? student.courses.join(', ') : (student.courses || 'None')}</td>
                  <td>${Array.isArray(student.skills) ? student.skills.join(', ') : (student.skills || 'None')}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-secondary btn-sm" onclick="handleViewStudent(${student.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-primary btn-sm" onclick="handleEditStudent(${student.id})" title="Edit Student">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="handleDeleteStudent(${student.id})" title="Delete Student">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      containers.forEach(container => container.innerHTML = html);

      // Add event listeners for search and sort
      document.getElementById('student-search').addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        const filtered = students.filter(s =>
          s.name.toLowerCase().includes(value) ||
          (s.courses && s.courses.join(', ').toLowerCase().includes(value)) ||
          (s.skills && s.skills.join(', ').toLowerCase().includes(value)) ||
          (s.email && s.email.toLowerCase().includes(value))
        );
        renderStudentsTable(filtered);
      });
      document.getElementById('student-sort').addEventListener('change', function(e) {
        const sortBy = e.target.value;
        const sorted = [...students].sort((a, b) => {
          if (sortBy === 'name') {
            return (a.name || '').localeCompare(b.name || '');
          }
          if (sortBy === 'courses') {
            const aCourses = a.courses ? a.courses.join(', ') : '';
            const bCourses = b.courses ? b.courses.join(', ') : '';
            return aCourses.localeCompare(bCourses);
          }
          if (sortBy === 'skills') {
            const aSkills = a.skills ? a.skills.join(', ') : '';
            const bSkills = b.skills ? b.skills.join(', ') : '';
            return aSkills.localeCompare(bSkills);
          }
          return 0;
        });
        renderStudentsTable(sorted);
      });
    }

    // --- ENHANCED DATA LOADING SYSTEM ---
    
    // Load data from JSON file or fallback to mock data
    async function loadData() {
        try {
            // Try to load from data.json file
            const response = await fetch('./data/data.json');
            if (!response.ok) throw new Error('Failed to load data.json');
            
            const data = await response.json();
            console.log('✅ Loaded data from data.json');
            return data;
        } catch (error) {
            console.warn('⚠️ Could not load data.json, using mock data:', error);
            
            // Fallback to enhanced mock data
            return {
                students: mockStudents.map((student, index) => ({
                    id: index + 1,
                    name: student.name,
                    email: student.email || `${student.name.toLowerCase().replace(' ', '.')}@university.edu`,
                    age: student.age || Math.floor(Math.random() * 10) + 18,
                    courses: student.courses,
                    skills: student.skills,
                    dateAdded: new Date().toISOString().split('T')[0]
                })),
                courses: mockCourses.map((course, index) => ({
                    id: index + 1,
                    name: course.name,
                    description: course.description
                })),
                skills: mockSkills.map((skill, index) => ({
                    id: index + 1,
                    name: skill.name,
                    description: skill.description
                }))
            };
        }
    }

    // Initialize all data loading
    async function initializeData() {
        const data = await loadData();
        
        // Render appropriate sections based on current page
        if (document.getElementById('courses-list')) {
            renderCoursesTable(data.courses);
        }
        
        if (document.getElementById('skills-list')) {
            renderSkillsTable(data.skills);
        }
        
        if (document.getElementById('students-list') || document.getElementById('recent-students-list')) {
            renderStudentsTable(data.students);
        }
        
        // Update dashboard stats if on dashboard
        updateDashboardStats(data);
        
        return data;
    }

    // Call the enhanced initialization
    initializeData().catch(console.error);
});

// Initialize page-specific functionality
function initializePageFunctionality() {
    // Add active class to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading"></span> Processing...';
                submitBtn.disabled = true;
                
                // Re-enable after 3 seconds (fallback)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });

    // Update stats on dashboard
    updateDashboardStats();
}

// Update dashboard statistics
function updateDashboardStats(data = null) {
    if (document.querySelector('.stat-number')) {
        if (data) {
            // Use provided data
            const studentCount = document.getElementById('total-students');
            const courseCount = document.getElementById('total-courses');
            const skillCount = document.getElementById('total-skills');
            
            if (studentCount) animateNumber(studentCount, data.students.length);
            if (courseCount) animateNumber(courseCount, data.courses.length);
            if (skillCount) animateNumber(skillCount, data.skills.length);
        } else {
            // Try API calls as fallback
            Promise.all([
                fetch('/students').then(r => r.json()).catch(() => []),
                fetch('/courses').then(r => r.json()).catch(() => []),
                fetch('/skills').then(r => r.json()).catch(() => [])
            ]).then(([students, courses, skills]) => {
                const studentCount = document.getElementById('total-students');
                const courseCount = document.getElementById('total-courses');
                const skillCount = document.getElementById('total-skills');
                
                if (studentCount) animateNumber(studentCount, students.length);
                if (courseCount) animateNumber(courseCount, courses.length);
                if (skillCount) animateNumber(skillCount, skills.length);
            });
        }
    }
}

// Animate number counting
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 50);
}

// Enhanced button functionality with better data handling
function handleViewStudent(studentId) {
    showModal('Student Details', `Loading student information...`);
    
    // Try to get data from current session or fetch fresh
    loadData().then(data => {
        const student = data.students.find(s => s.id === studentId);
        if (student) {
            const modalContent = `
                <div class="student-details">
                    <h5>${student.name}</h5>
                    <p><strong>Email:</strong> ${student.email || 'Not provided'}</p>
                    <p><strong>Age:</strong> ${student.age || 'Not provided'}</p>
                    <p><strong>Courses:</strong> ${Array.isArray(student.courses) ? student.courses.join(', ') : (student.courses || 'None')}</p>
                    <p><strong>Skills:</strong> ${Array.isArray(student.skills) ? student.skills.join(', ') : (student.skills || 'None')}</p>
                    ${student.dateAdded ? `<p><strong>Date Added:</strong> ${student.dateAdded}</p>` : ''}
                </div>
            `;
            updateModalContent('Student Details', modalContent);
        } else {
            updateModalContent('Error', 'Student not found.');
        }
    }).catch(error => {
        updateModalContent('Error', 'Failed to load student information.');
        console.error('Error loading student:', error);
    });
}

function handleEditStudent(studentId) {
    fetch(`/students`)
        .then(response => response.json())
        .then(students => {
            const student = students.find(s => s.id === studentId);
            if (student) {
                const modalContent = `
                    <form id="edit-student-form" class="modern-form-content">
                        <div class="form-group">
                            <label for="edit-name" class="form-label">Name</label>
                            <input type="text" id="edit-name" name="name" value="${student.name}" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-email" class="form-label">Email</label>
                            <input type="email" id="edit-email" name="email" value="${student.email || ''}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="edit-age" class="form-label">Age</label>
                            <input type="number" id="edit-age" name="age" value="${student.age || ''}" class="form-control">
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn-modern btn-primary">Update Student</button>
                            <button type="button" class="btn-modern btn-outline" onclick="closeModal()">Cancel</button>
                        </div>
                    </form>
                `;
                showModal('Edit Student', modalContent);
                
                document.getElementById('edit-student-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    data.id = studentId;
                    
                    fetch('/update-student', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.text())
                    .then(message => {
                        showAlert(message, 'success');
                        closeModal();
                        location.reload();
                    })
                    .catch(error => {
                        showAlert('Error updating student', 'error');
                    });
                });
            }
        });
}

function handleDeleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch('/delete-student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId })
        })
        .then(response => response.text())
        .then(message => {
            showAlert(message, 'success');
            location.reload();
        })
        .catch(error => {
            showAlert('Error deleting student', 'error');
        });
    }
}

// Similar functions for courses and skills
function handleViewCourse(courseId) {
    fetch(`/courses`)
        .then(response => response.json())
        .then(courses => {
            const course = courses.find(c => c.id === courseId);
            if (course) {
                const modalContent = `
                    <div class="course-details">
                        <h5>${course.name}</h5>
                        <p><strong>Description:</strong> ${course.description || 'No description provided'}</p>
                    </div>
                `;
                showModal('Course Details', modalContent);
            }
        });
}

function handleEditCourse(courseId) {
    fetch(`/courses`)
        .then(response => response.json())
        .then(courses => {
            const course = courses.find(c => c.id === courseId);
            if (course) {
                const modalContent = `
                    <form id="edit-course-form" class="modern-form-content">
                        <div class="form-group">
                            <label for="edit-course-name" class="form-label">Course Name</label>
                            <input type="text" id="edit-course-name" name="course_name" value="${course.name}" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-course-description" class="form-label">Description</label>
                            <textarea id="edit-course-description" name="description" class="form-control" rows="3">${course.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn-modern btn-primary">Update Course</button>
                            <button type="button" class="btn-modern btn-outline" onclick="closeModal()">Cancel</button>
                        </div>
                    </form>
                `;
                showModal('Edit Course', modalContent);
                
                document.getElementById('edit-course-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    data.id = courseId;
                    
                    fetch('/update-course', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.text())
                    .then(message => {
                        showAlert(message, 'success');
                        closeModal();
                        location.reload();
                    })
                    .catch(error => {
                        showAlert('Error updating course', 'error');
                    });
                });
            }
        });
}

function handleDeleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        fetch('/delete-course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: courseId })
        })
        .then(response => response.text())
        .then(message => {
            showAlert(message, 'success');
            location.reload();
        })
        .catch(error => {
            showAlert('Error deleting course', 'error');
        });
    }
}

// Skill functions
function handleViewSkill(skillId) {
    fetch(`/skills`)
        .then(response => response.json())
        .then(skills => {
            const skill = skills.find(s => s.id === skillId);
            if (skill) {
                const modalContent = `
                    <div class="skill-details">
                        <h5>${skill.name}</h5>
                        <p><strong>Description:</strong> ${skill.description || 'No description provided'}</p>
                    </div>
                `;
                showModal('Skill Details', modalContent);
            }
        });
}

function handleEditSkill(skillId) {
    fetch(`/skills`)
        .then(response => response.json())
        .then(skills => {
            const skill = skills.find(s => s.id === skillId);
            if (skill) {
                const modalContent = `
                    <form id="edit-skill-form" class="modern-form-content">
                        <div class="form-group">
                            <label for="edit-skill-name" class="form-label">Skill Name</label>
                            <input type="text" id="edit-skill-name" name="skill_name" value="${skill.name}" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-skill-description" class="form-label">Description</label>
                            <textarea id="edit-skill-description" name="description" class="form-control" rows="3">${skill.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn-modern btn-primary">Update Skill</button>
                            <button type="button" class="btn-modern btn-outline" onclick="closeModal()">Cancel</button>
                        </div>
                    </form>
                `;
                showModal('Edit Skill', modalContent);
                
                document.getElementById('edit-skill-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    data.id = skillId;
                    
                    fetch('/update-skill', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.text())
                    .then(message => {
                        showAlert(message, 'success');
                        closeModal();
                        location.reload();
                    })
                    .catch(error => {
                        showAlert('Error updating skill', 'error');
                    });
                });
            }
        });
}

function handleDeleteSkill(skillId) {
    if (confirm('Are you sure you want to delete this skill?')) {
        fetch('/delete-skill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: skillId })
        })
        .then(response => response.text())
        .then(message => {
            showAlert(message, 'success');
            location.reload();
        })
        .catch(error => {
            showAlert('Error deleting skill', 'error');
        });
    }
}

// Modal functionality
function showModal(title, content) {
    const modal = document.getElementById('modal');
    if (modal) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function updateModalContent(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Alert functionality
function showAlert(message, type = 'success') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="d-flex justify-between items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-sm" style="background: none; border: none; color: inherit;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Insert at the top of the main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alert, main.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

function handleStudentForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('add-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.text())
      .then(text => {
          document.getElementById('response-message').innerText = text;
          event.target.reset();
      })
      .catch(error => console.error('Error:', error));
}

function handleCourseForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('/add-course', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.text())
      .then(text => {
          document.getElementById('response-message').innerText = text;
          event.target.reset();
      })
      .catch(error => console.error('Error:', error));
}

function handleSkillForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('/add-skill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.text())
      .then(text => {
          document.getElementById('response-message').innerText = text;
          event.target.reset();
      })
      .catch(error => console.error('Error:', error));
}

