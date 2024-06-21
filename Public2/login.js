document.getElementById('loginButton').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Redirect to Homepage
    window.location.href = 'http://localhost:3000/';
});
