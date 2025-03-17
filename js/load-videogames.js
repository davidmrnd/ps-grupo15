function loadVideogames() {
    fetch('/database.json')
        .then(response => response.json())
        .then(data => {
            const carouselsContainer = document.getElementById('carousels');
            data.videogames.forEach(videogame => {
                fetch('/templates/carousel.html')
                    .then(response => response.text())
                    .then(template => {
                        const carousel = document.createElement('div');
                        carousel.innerHTML = template;
                        carousel.querySelector('.carousel-title h1').innerText = videogame.title;
                        carousel.querySelector('#videogameimage').href = `/videogameprofile.html?id=${videogame.id}`;
                        carousel.querySelector('#videogame1').src = videogame.imagecarousel;
                        carousel.querySelector('#videogame1').alt = `${videogame.title} image`;
                        carouselsContainer.appendChild(carousel);
                    });
            });
        });
}
