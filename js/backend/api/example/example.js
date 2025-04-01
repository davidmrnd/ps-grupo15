async function search() {
    // Se leen las claves de acceso
    const keys = await readKeys();
    const clientID = keys["client-id"];
    const accessToken = keys["access-token"];

    // Input de búsqueda
    const gameNameInput = document.querySelector("input");

    // Divs donde se muestran mensajes sobre la búsqueda y los resultados
    const divSearching = document.querySelector("div#searching");
    const resultTable = document.querySelector("table#result");

    // Botón de búsqueda
    const searchButton = document.querySelector("button");

    // Se muestra un mensaje mientras se realiza la consulta y se borra cualquier resultado previo
    divSearching.innerHTML = "Realizando busqueda...";
    resultTable.innerHTML = "";

    // Se desabilita el botón y el cuadro de búsqueda
    searchButton.disabled = true;
    gameNameInput.disabled = true;

    // Se realiza la búsqueda
    let searchResults = await searchByGenreAndName(clientID, accessToken, 30, gameNameInput.value);

    // Si hay resultados, se muestran
    if (searchResults.length > 0) {
        // Se crea una lista con los ID de los videojuegos
        let idList = [];
        for (const game of searchResults) {
            idList.push(game["id"]);
        }

        // Se obtienen las portadas de los videojuegos obtenidos con la búsqueda
        let covers = await getCovers(clientID, accessToken, idList);

        // Se elimina el mensaje mostrado durante la búsqueda
        divSearching.innerHTML = "";

        // Se crea y se añade la cabecera de la tabla
        const tableHeader = document.createElement("tr");
        tableHeader.innerHTML = "<th>Nombre</th><th>Imagen</th>";

        resultTable.appendChild(tableHeader);

        // Se muestran los resultados de la búsqueda en la tabla
        for (const result of searchResults) {
            // Se crea una fila de la tabla para cada videojuego
            const trGame = document.createElement("tr");

            // Se añade el título del videojuego
            trGame.innerHTML = "<td>" + result["name"] + "</td>";

            // Se busca en las portadas obtenidas si se encuentra la del videojuego actual
            const actualCover = covers.find((cover) => cover["game"] === result["id"]);

            // Si se encuentra la portada se añade a la tabla
            if (actualCover) {
                const tdPicture = document.createElement("td");
                const imgElement = document.createElement("img");
                imgElement.src = `https://images.igdb.com/igdb/image/upload/t_cover_big/${actualCover["image_id"]}.jpg`
                tdPicture.appendChild(imgElement);
                trGame.appendChild(tdPicture);
            }

            resultTable.appendChild(trGame);
        }
    } else {
        // Si no hay resultados se muestra un mensaje
        divSearching.innerHTML = "No se han encontrado resultados";
    }

    // Se habilita el botón y el cuadro de búsqueda
    searchButton.disabled = false;
    gameNameInput.disabled = false;
}