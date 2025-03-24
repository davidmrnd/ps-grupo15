function loadVideogames(categoryName) {
    fetch('/templates/carousel.html')
        .then(response => response.text())
        .then(template => {
            fetch('/database.json')
                .then(response => response.json())
                .then(data => {
                    const carouselsContainer = document.getElementById(categoryName);
                    const carousel = document.createElement('div');
                    carousel.innerHTML = template;
                    const filteredVideogames = data.videogames.filter(videogame => videogame.category.includes(categoryName)).slice(0, 5);
                    filteredVideogames.forEach((videogame, index) => {
                        const imgId = `videogame${index + 1}`;
                        const imgElement = carousel.querySelector(`#${imgId}`);
                        imgElement.src = videogame.imagecarousel;
                        imgElement.alt = `${videogame.title} image`;
                        imgElement.parentElement.href = `videogameprofile.html?id=${videogame.id}`;
                    });
                    carousel.querySelector('.carousel-title h1').innerText = categoryName;
                    carouselsContainer.appendChild(carousel);
                });
        });
}
