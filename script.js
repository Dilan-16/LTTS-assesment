// public/script.js

function showRegistrationForm() {
    document.getElementById('registrationForm').style.display = 'block';
  }
  
  function hideRegistrationForm() {
    document.getElementById('registrationForm').style.display = 'none';
  }
  
  async function registerUser(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
  
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      });
  
      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error('Registration error:', error.message);
      alert('Registration failed.');
    }
  }
  
