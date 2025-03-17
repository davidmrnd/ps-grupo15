function loadVideogameProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const videogameId = urlParams.get('id');

    fetch('/database.json')
        .then(response => response.json())
        .then(data => {
            const videogame = data.videogames.find(vg => vg.id == videogameId);
            if (videogame) {
                fetch('/templates/profile.html')
                    .then(response => response.text())
                    .then(template => {
                        const profileContainer = document.getElementById('profile');
                        profileContainer.innerHTML = template;
                        profileContainer.querySelector('h1').innerText = videogame.title;
                        profileContainer.querySelector('.subtitle').innerText = videogame.subtitle;
                        profileContainer.querySelector('.description').innerText = videogame.description;
                        profileContainer.querySelector('.usericon').src = videogame.imageprofile;
                    });
                fetch('/templates/videogameprofile.html?id=${videogame.id}')
                    .then(response => response.text())
                    .then(template => {
                        document.getElementById('add-comment').href = `/newcomment.html?id=${videogame.id}`;
                        
                    });
            }
        });
}
