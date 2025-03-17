function loadUserProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    fetch('/database.json')
        .then(response => response.json())
        .then(data => {
            const user = data.users.find(u => u.id == userId);
            if (user) {
                fetch('/templates/profile.html')
                    .then(response => response.text())
                    .then(template => {
                        const profileContainer = document.getElementById('profile');
                        profileContainer.innerHTML = template;
                        profileContainer.querySelector('h1').innerText = user.name;
                        profileContainer.querySelector('.subtitle').innerText = user.email;
                        profileContainer.querySelector('.description').innerText = user.password;
                        profileContainer.querySelector('.usericon').src = user.profileicon;
                        profileContainer.querySelector('.usericon').alt = `${user.name}'s profile picture`;
                    });
            }
        });
}