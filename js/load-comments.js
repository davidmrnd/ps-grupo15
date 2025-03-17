function loadComments() {
    const urlParams = new URLSearchParams(window.location.search);
    const videogameId = urlParams.get('id');

    fetch('/database.json')
        .then(response => response.json())
        .then(data => {
            const commentsContainer = document.getElementById('comentaries');
            const comments = data.comments.filter(comment => comment.videogameId == videogameId);

            comments.forEach(comment => {
                fetch('/templates/comentaries.html')
                    .then(response => response.text())
                    .then(template => {
                        const commentElement = document.createElement('div');
                        commentElement.innerHTML = template;
                        const user = data.users.find(user => user.id == comment.userId);
                        commentElement.querySelector('.info h3').innerText = user.name;
                        commentElement.querySelector('.info p').innerText = comment.content;
                        commentElement.querySelector(`input#star${comment.rating}`).checked = true;
                        const profileImage = commentElement.querySelector('.avatar');
                        profileImage.src = user.profileicon;
                        profileImage.alt = `${user.name}'s profile picture`;
                        commentElement.querySelector('#userlink').href = `userprofile.html?id=${user.id}`;
                        commentsContainer.appendChild(commentElement);
                    });
            });
        });
}
