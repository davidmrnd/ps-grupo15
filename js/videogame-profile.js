function videogameProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const videogameId = urlParams.get('id');
    const useAPI = urlParams.get('api');

    if (useAPI === "true") {
        readKeys()
            .then(keys => {
                const clientID = keys["client-id"];
                const accessToken = keys["access-token"];
                getCoverAndGameInfo(clientID, accessToken, parseInt(videogameId))
                    .then(multiquery => {
                        const videogame = multiquery[0].result[0];
                        const portada = multiquery[1].result[0];

                        if (videogame) {
                            fetch('/templates/profile.html')
                                .then(response => response.text())
                                .then(template => {
                                    const profileContainer = document.getElementById('profile');
                                    profileContainer.innerHTML = template;

                                    let title = videogame.name;
                                    const releaseYear = getReleaseYear(videogame.first_release_date);
                                    if (!isNaN(releaseYear)) {
                                        title += ` (${releaseYear})`;
                                    }
                                    profileContainer.querySelector('h1').innerText = title;

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

                                    profileContainer.querySelector('.usericon').src = `https://images.igdb.com/igdb/image/upload/t_cover_big/${portada["image_id"]}.png`;
                                });
                            const addCommentButton = document.getElementById('add-comment');
                            if(addCommentButton) {
                                addCommentButton.href = `newcomment.html?id=${videogame.id}&api=true`;
                            }
                        }
                    });
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
