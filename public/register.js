register.js
// Get references to form elements and error message containers
const registrationForm = document.getElementById('registrationForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Regular expressions for basic validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to validate email format
function validateEmail(email) {
    return emailRegex.test(email);
}

// Function to handle form submission and validation
registrationForm.addEventListener('submit', function(event) {
    // Prevent form submission
    event.preventDefault();

    // Clear previous error messages
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';

    // Get values from inputs
    const usernameValue = usernameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    // Validate username
    if (usernameValue === '') {
        usernameError.textContent = 'Username is required';
        usernameInput.focus();
        return;
    }

    // Validate email
    if (emailValue === '') {
        emailError.textContent = 'Email is required';
        emailInput.focus();
        return;
    } else if (!validateEmail(emailValue)) {
        emailError.textContent = 'Email is not valid';
        emailInput.focus();
        return;
    }

    // Validate password
    if (passwordValue === '') {
        passwordError.textContent = 'Password is required';
        passwordInput.focus();
        return;
    } else if (passwordValue.length < 6) { 
        passwordError.textContent = 'Password must be at least 6 characters long';
        passwordError.style.color = 'red'; // Set error message color to dark red
        passwordError.style.fontSize = '0.9em'; // Set error message font size to 0.8em
        passwordError.style.marginTop= '15px';
        passwordInput.focus();
        return;
    }
    registrationForm.reset();
});


