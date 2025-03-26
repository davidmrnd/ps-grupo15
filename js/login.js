function handleLogin() {
    document.getElementById('login-button').onclick = function() {
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
}
