const loginHandler = async (e) => {
    e.preventDefault();
    const user = document.querySelector('#ursername').value;
    const password = document.querySelector('#password').value;
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
    const user_name = document.querySelector('#aligned-username').value;
    const email = document.querySelector('#aligned-email').value;
    const password = document.querySelector('#aligned-password').value;
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

document.querySelector('.sign-in-form').addEventListener('submit', loginHandler);
document.querySelector('.sign-up-form').addEventListener('submit', signupHandler);