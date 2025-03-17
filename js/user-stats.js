function loadUserStats() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    fetch('/database.json')
        .then(response => response.json())
        .then(data => {
            const user = data.users.find(u => u.id == userId);
            if (user) {
                fetch('/templates/socialstats.html')
                    .then(response => response.text())
                    .then(template => {
                        const profileContainer = document.getElementById('socialstats');
                        profileContainer.innerHTML = template;
                        profileContainer.querySelector('#followers').innerText = user.followers.length;
                        profileContainer.querySelector('#following').innerText = user.following.length;
                        profileContainer.querySelector('#valoraciones').innerText = data.comments.filter(comment => comment.userId == userId).length;
                    });
            }
        });
}