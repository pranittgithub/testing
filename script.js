const signupFormContainer = document.getElementById('signupFormContainer');
const loginFormContainer = document.getElementById('loginFormContainer');

document.getElementById('goToSignup').addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer.classList.add('hidden');
    signupFormContainer.classList.remove('hidden');
});

document.getElementById('goToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    signupFormContainer.classList.add('hidden');
    loginFormContainer.classList.remove('hidden');
});

document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Signup failed');
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            // Redirect to login page
            signupFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
        })
        .catch((error) => alert(error.message));
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            // Redirect to dashboard or home page after login
            window.location.href = '/dashboard'; // Update with the desired redirect URL
        })
        .catch((error) => {
            alert(error.message);
            // Redirect to signup if the user doesn't have an account
            loginFormContainer.classList.add('hidden');
            signupFormContainer.classList.remove('hidden');
        });
});
