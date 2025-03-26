function loadVideogameComments() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    fetch('/database.json')
        .then(response => response.json())
        .then(data => {
            const commentsContainer = document.getElementById('comentaries');
            const comments = data.comments.filter(comment => comment.userId == userId);

            comments.forEach(comment => {
                fetch('/templates/comentaries.html')
                    .then(response => response.text())
                    .then(template => {
                        const commentElement = document.createElement('div');
                        commentElement.innerHTML = template;
                        const videogame = data.videogames.find(videogame => videogame.id == comment.videogameId);
                        commentElement.querySelector('.info h3').innerText = videogame.title;
                        commentElement.querySelector('.info p').innerText = comment.content;
                        commentElement.querySelector(`input#star${comment.rating}`).checked = true;
                        const profileImage = commentElement.querySelector('.avatar');
                        profileImage.src = videogame.imageprofile;
                        profileImage.alt = `${videogame.title} image`;
                        commentElement.querySelector('#userlink1').href = `videogameprofile.html?id=${videogame.id}`;
                        commentElement.querySelector('#userlink2').href = `videogameprofile.html?id=${videogame.id}`;
                        commentsContainer.appendChild(commentElement);
                    });
            });
        });
}
