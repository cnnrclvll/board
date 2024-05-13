const loginhandler = async (e) => {
    e.preventDefault();
    const user = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;
    const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({ user, password }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert('Failed to log in.');
    }
};

const signupHandler = async (e) => {
    e.preventDefault();
    const user_name = document.querySelector('#signup-username').value;
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;
    const response = await fetch('/api/user/', {
        method: 'POST',
        body: JSON.stringify({ user_name, email, password }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert('Failed to sign up.');
    }
};

document.querySelector('.login-form').addEventListener('submit', loginhandler);
document.querySelector('.signup-form').addEventListener('submit', signupHandler);