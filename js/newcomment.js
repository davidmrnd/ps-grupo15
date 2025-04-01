function prepareCommentForm() {
    fetch('/templates/comentaries.html')
        .then(response => response.text())
        .then(template => {
            const commentsContainer = document.getElementById('comentaries');
            commentsContainer.innerHTML = template;
            const commentElement = commentsContainer.querySelector('.comment');
            commentElement.querySelector('.info p').innerHTML = '<input type="text" id="comment-content" class="styled-input" placeholder="Escribe tu comentario">';

            fetch('/templates/stars.html')
                .then(response => response.text())
                .then(starsTemplate => {
                    commentElement.querySelector('.rating').innerHTML = starsTemplate;
                    const starInputs = commentElement.querySelectorAll('.rating input');
                    starInputs.forEach(input => input.removeAttribute('disabled'));
                });

            const userId = sessionStorage.getItem('loggedInUser');
            if (userId) {
                fetch('/database.json')
                    .then(response => response.json())
                    .then(data => {
                        const user = data.users.find(u => u.id == userId);
                        if (user) {
                            commentElement.querySelector('.info h3').innerText = user.name;
                            const profileImage = commentElement.querySelector('.avatar');
                            profileImage.src = user.profileicon;
                            profileImage.alt = `${user.name}'s profile picture`;
                            commentElement.querySelector('#userlink1').href = `userprofile.html?id=${user.id}`;
                            commentElement.querySelector('#userlink2').href = `userprofile.html?id=${user.id}`;
                        }
                    });
            }
        });

    document.getElementById('send-comment').addEventListener('click', () => {
        const content = document.getElementById('comment-content').value;
        const ratingElement = document.querySelector('input[name="rating"]:checked');
        const rating = ratingElement ? ratingElement.value : null;
        const videogameId = new URLSearchParams(window.location.search).get('id');
        const userId = sessionStorage.getItem('loggedInUser');

        if (content && rating && userId) {
            fetch('/database.json')
                .then(response => response.json())
                .then(data => {
                    const newComment = {
                        id: data.comments.length + 1,
                        userId: parseInt(userId),
                        videogameId: parseInt(videogameId),
                        content: content,
                        rating: parseInt(rating)
                    };
                    data.comments.push(newComment);
                    return fetch('/database.json', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                })
                .then(() => {
                    window.location.href = `videogameprofile.html?id=${videogameId}`;
                });
        } else {
            let messageElement = document.getElementById('message');
            if (!messageElement) {
                messageElement = document.createElement('p');
                messageElement.id = 'message';
                messageElement.style.color = '#CD4D4D';
                messageElement.style.textAlign = 'center';
                messageElement.style.marginTop = '10px';
                document.querySelector('main').appendChild(messageElement);
            }
            messageElement.textContent = "Por favor, completa todos los campos.";
        }
    });
}
