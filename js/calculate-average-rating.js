function calculateAndDisplayAverageRating(videogameId) {
    fetch('/database.json')
        .then(response => response.json())
        .then(data => {
            const comments = data.comments.filter(comment => comment.videogameId == videogameId);
            if (comments.length === 0) return;

            const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
            const averageRating = Math.round(totalRating / comments.length);

            const starsContainer = document.querySelector('#stars .rating');
            if (starsContainer) {
                for (let i = 1; i <= 5; i++) {
                    const starInput = starsContainer.querySelector(`input#star${i}-videogame-profile`);
                    if (starInput) {
                        starInput.checked = i === averageRating;
                    }
                }
            }
        });
}
