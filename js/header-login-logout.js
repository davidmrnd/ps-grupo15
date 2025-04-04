function modifyHeader() {
    const rightContainer = document.querySelector('.right-container');
    const isLoggedIn = sessionStorage.getItem('loggedInUser');

    if (rightContainer) {
        rightContainer.innerHTML = '';

        if (isLoggedIn) {
            const iconbutton = document.querySelector('#iconbutton');
            iconbutton.href = 'userprofile.html?id=' + isLoggedIn;
            const iconsource = document.querySelector('.profile-img');
            fetch('/database.json')
                .then(response => response.json())
                .then(data => {
                    const user = data.users.find(user => user.id === isLoggedIn);
                    console.log(user); console.log(isLoggedIn);
                    if (user && user.profileicon) {
                        iconsource.src = user.profileicon;
                    } else {
                        iconsource.src = 'images/logo.webp';
                    }
                })
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
            profileContainer.appendChild(logoutButton);
        }
    }
}

function checkLoginForComment() {
    const addCommentButton = document.querySelector('.new-comment');
    const isLoggedIn = sessionStorage.getItem('loggedInUser');

    if (addCommentButton) {
        addCommentButton.addEventListener('click', (event) => {
            if (!isLoggedIn) {
                event.preventDefault();
                const messageElement = document.createElement('p');
                messageElement.textContent = "Debes iniciar sesión para añadir un comentario.";
                document.body.appendChild(messageElement);
                window.location.href = 'signin.html';
            }
        });
    }
}
