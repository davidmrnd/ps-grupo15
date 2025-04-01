function videogameProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const videogameId = urlParams.get('id');
    const useAPI = urlParams.get('api');

    if (useAPI === "true") {
        fetch(`http://localhost:4000/game/${videogameId}`)
            .then(response => response.json())
            .then(data => {
                const videogame = data["apiResponse"][0].result[0];
                const cover = data.apiResponse[1].result[0];

                if (videogame) {
                    fetch('/templates/profile.html')
                        .then(response => response.text())
                        .then(template => {
                            const profileContainer = document.getElementById('profile');
                            profileContainer.innerHTML = template;

                            fetch(`http://localhost:4000/release-year/${videogame.first_release_date}`)
                                .then(response => response.json())
                                .then(data => {
                                    let title = videogame.name;
                                    const releaseYear = data["releaseYear"];
                                    if (!isNaN(releaseYear)) {
                                        title += ` (${releaseYear})`;
                                    }
                                    profileContainer.querySelector('h1').innerText = title;
                                });


                            if (videogame.summary) {
                                profileContainer.querySelector('.subtitle').innerText = videogame.summary;
                            } else {
                                profileContainer.querySelector('.subtitle').innerText = "";
                            }

                            if (videogame.storyline) {
                                profileContainer.querySelector('.description').innerText = videogame.storyline;
                            }
                            else {
                                profileContainer.querySelector('.description').innerText = "";
                            }

                            profileContainer.querySelector('.usericon').src = `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover["image_id"]}.png`;
                        });
                    const addCommentButton = document.getElementById('add-comment');
                    if(addCommentButton) {
                        addCommentButton.href = `newcomment.html?id=${videogame.id}&api=true`;
                    }
                }
            });
    }
    else {
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
                    const addCommentButton = document.getElementById('add-comment');
                    if(addCommentButton) {
                        addCommentButton.href = `newcomment.html?id=${videogame.id}`;
                    }
                    /**
                    fetch('videogameprofile.html?id=${videogame.id}')
                        .then(response => response.text())
                        .then(template => {
                            document.getElementById('add-comment').href = `newcomment.html?id=${videogame.id}`;

                        });
                     **/
                }
            });
    }
}
