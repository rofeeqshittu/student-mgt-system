document.addEventListener('DOMContentLoaded', () => {
    // Handle form submissions
    const studentForm = document.getElementById('student-form');
    const courseForm = document.getElementById('course-form');
    const skillForm = document.getElementById('skill-form');

    if (studentForm) studentForm.addEventListener('submit', handleStudentForm);
    if (courseForm) courseForm.addEventListener('submit', handleCourseForm);
    if (skillForm) skillForm.addEventListener('submit', handleSkillForm);
});

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

