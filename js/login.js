function handleLogin() {
    const loginFunction = function() {
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const messageElement = document.getElementById('message');
        fetch('/database.json')
            .then(response => response.json())
            .then(data => {
                const user = data.users.find(u => u.email === email && u.password === password);
                if (user) {
                    sessionStorage.setItem('loggedInUser', user.id);
                    window.location.href = 'index.html';
                } else {
                    messageElement.textContent = "Usuario o contraseña incorrectos ";
                    messageElement.style.color = "#CD4D4D";
                }
            });
    };

    document.getElementById('login-button').onclick = loginFunction;

    document.getElementById('email-input').onkeypress = function(event) {
        if (event.key === 'Enter') {
            loginFunction();
        }
    };

    document.getElementById('password-input').onkeypress = function(event) {
        if (event.key === 'Enter') {
            loginFunction();
        }
    };
}
