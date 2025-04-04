async function search() {
    const searchButton = document.querySelector('.search-button');
    const searchBox = document.querySelector('.search-box');
    const searchResults = document.createElement('div');
    searchResults.classList.add('search-results');
    document.body.appendChild(searchResults);
    const useApi = false;

    searchButton.addEventListener('click', () => {
        getResults();
    });

    searchBox.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            getResults();
        }
    });

    function displayResults(results) {
        searchResults.innerHTML = '';
        if (results.length > 0) {
            results.forEach(videogame => {
                const resultItem = document.createElement('a');
                if (useApi) {
                    resultItem.href = `videogameprofile.html?id=${videogame.id}&api=true`;
                    resultItem.innerText = `${videogame.name}`;
                    if (!isNaN(videogame.first_release_date)) {
                        fetch(`http://localhost:4000/release-year/${videogame.first_release_date}`)
                            .then(res => res.json())
                            .then(data => {
                                const releaseYear = data["releaseYear"];
                                resultItem.innerText += ` (${releaseYear})`;
                            });
                    }
                }
                else {
                    resultItem.href = `videogameprofile.html?id=${videogame.id}`;
                    resultItem.innerText = videogame.title;
                }
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.innerText = 'No results found';
        }
        searchResults.style.display = 'block';
        positionResults();
    }

    function positionResults() {
        const rect = searchBox.getBoundingClientRect();
        searchResults.style.top = `${rect.bottom + window.scrollY}px`;
        searchResults.style.left = `${rect.left + window.scrollX}px`;
        searchResults.style.width = `${rect.width}px`;
    }

    document.addEventListener('click', (event) => {
        if (!searchBox.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });

    function getResults() {
        const query = searchBox.value.trim().toLowerCase();
        if (query) {
            if (useApi) {
                fetch("http://localhost:4000/search", {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        limit: 10,
                        query: query,
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        displayResults(data["apiResponse"]);
                    })
            } else {
                fetch('/database.json')
                    .then(response => response.json())
                    .then(data => {
                        const results = data.videogames.filter(videogame => videogame.title.toLowerCase().includes(query));
                        displayResults(results);
                    });
            }
        }
    }
}