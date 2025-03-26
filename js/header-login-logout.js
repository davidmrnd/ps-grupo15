function modifyHeader() {
    const rightContainer = document.querySelector('.right-container');
    const isLoggedIn = sessionStorage.getItem('loggedInUser');

    if (rightContainer) {
        rightContainer.innerHTML = '';

        if (isLoggedIn) {
            const profileButton = document.createElement('a');
            profileButton.href = 'userprofile.html?id=' + isLoggedIn;
            profileButton.classList.add('cta-button');
            profileButton.innerText = 'Mi Perfil';
            rightContainer.appendChild(profileButton);
        } else {
            const registerButton = document.createElement('a');
            registerButton.href = 'signup.html';
            registerButton.classList.add('cta-button');
            registerButton.innerText = 'Registrarse';
            rightContainer.appendChild(registerButton);

            const loginButton = document.createElement('a');
            loginButton.href = 'signin.html';
            loginButton.classList.add('login-text');
            loginButton.innerText = 'Iniciar sesión';
            rightContainer.appendChild(loginButton);
        }
    }
}

function addLogoutButton() {
    const userId = new URLSearchParams(window.location.search).get('id');
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    
    if (userId && loggedInUser && userId === loggedInUser) {
        const profileContainer = document.querySelector('.profilesocialstats-container');
        
        if (profileContainer) {
            const logoutButton = document.createElement('button');
            logoutButton.classList.add('cta-button');
            logoutButton.id = 'logoutButton';
            logoutButton.innerText = 'Cerrar sesión';
            logoutButton.onclick = function() {
                sessionStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            };
            profileContainer.appendChild(logoutButton);
        }
    }
}
