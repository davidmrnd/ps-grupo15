/**
 * Lee y devuelve las claves del fichero keys.json
 * @param path {string} Ruta al fichero que contiene las claves
 */
async function readKeys(path = "/js/api/keys.json") {
    return await readJSON(path);
}

/**
 * Lee y devuelve el contenido JSON de una URL
 * @param url {string} URL a la que se desea realizar la petición
 * @param params {Object} Parámetros de la petición
 */
async function readJSON(url, params) {
    const response = await fetch(url, params);
    return {
        status: response.status,
        statusText: response.statusText,
        apiResponse: await response.json(),
    };
}

/**
 * Realiza la petición para generar una clave de acceso y la devuelve
 * @param clientID {string} ID de cliente (se encuentra en el fichero keys.json)
 * @param secret {string} Secreto (se encuentra en el fichero keys.json)
 */
async function getAccessToken(clientID, secret) {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${secret}&grant_type=client_credentials`;
    const params = {
        method: 'POST',
    }

    let response = await readJSON(url, params);
    return response["access_token"];
}

/**
 * Realiza una consulta a la base de datos de IGDB
 * @param clientID {string} ID de cliente (se encuentra en el fichero keys.json)
 * @param accessToken {string} Clave de acceso (se encuentra en el fichero keys.json)
 * @param query {string} Consulta a realizar (Más info: https://api-docs.igdb.com/#apicalypse-1)
 * @param url {string} Url del endpoint al que realizar la petición (Lista de endpoints: https://api-docs.igdb.com/#endpoints)
 */
async function makeQuery(clientID, accessToken, query, url = "https://api.igdb.com/v4/games") {
    const params = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': clientID,
            'Authorization': 'Bearer ' + accessToken,
        },
        body: query
    }

    return await readJSON(url, params);
}

/**
 * Devuelve todos los datos de un videojuego
 * @param clientID {string} ID de cliente (se encuentra en el fichero keys.json)
 * @param accessToken {string} Clave de acceso (se encuentra en el fichero keys.json)
 * @param id {number} ID del videojuego en la base de datos
 */
async function getVideogameData(clientID, accessToken, id) {
    const query = "fields *; where id = " + id + ";";
    return await makeQuery(clientID, accessToken, query);
}

/**
 * Realiza una búsqueda por nombre y género
 * @param clientID {string} ID de cliente (se encuentra en el fichero keys.json)
 * @param accessToken {string} Clave de acceso (se encuentra en el fichero keys.json)
 * @param limit {number} Límite de resultados a obtener
 * @param string {string} String a buscar en el título del videojuego (opcional)
 * @param genreList {Array<number>} Lista con los ID de los generos a buscar (opcional).
 * Los ID de los generos se pueden obtener del siguiente endpoint: https://api-docs.igdb.com/#genre
 */
async function searchByGenreAndName(
    clientID,
    accessToken,
    limit,
    string = undefined,
    genreList = undefined
) {
    let query = `fields name,id,genres,first_release_date; limit ${limit};`;

    // Realiza la búsqueda por nombre
    if (string !== undefined) {
        query += ` search "${string}";`;
    }

    // Filtros para refinar la búsqueda
    query += " where game_type = (0, 2, 4, 8, 9) & (game_status = (0, 2, 4) | game_status = null)  & version_parent = null";

    // Realiza la búsqueda por genero
    if (genreList !== undefined) {
        if (!(genreList instanceof Array)) {
            return {
                status: 400,
                statusText: "Bad Request",
                message: "genreList must be an array of numbers (ex: [12, 16])"
            }
        }

        let genreString = "";
        for (const genre of genreList) {
            genreString += genre + ",";
        }

        query += " & genres = (" + genreString.substring(0, genreString.length - 1) + ");";
    }
    else query += ";";

    return await makeQuery(clientID, accessToken, query);
}

// Obtiene la URL de la portada de un videojuego
// clientID: ID de cliente (se encuentra en el fichero keys.json)
// accessToken: Clave de acceso (se encuentra en el fichero keys.json)
// id: ID del videojuego
// sizeType: Tamaño de imagen (Más info: https://api-docs.igdb.com/#images)
/**
 * Obtiene la URL de la portada de un videojuego
 * @param clientID {string} ID de cliente (se encuentra en el fichero keys.json)
 * @param accessToken {string} Clave de acceso (se encuentra en el fichero keys.json)
 * @param id {number} ID del videojuego
 * @param sizeType {string} Tamaño de imagen (Más info: https://api-docs.igdb.com/#images)
 */
async function getCoverURL(clientID, accessToken, id, sizeType) {
    let url="https://api.igdb.com/v4/covers";
    let query = `fields game,image_id; where game = ${id};`;

    let response = await makeQuery(clientID, accessToken, query, url);
    if (response["apiResponse"][0]) {
        response.fullURL = `https://images.igdb.com/igdb/image/upload/t_${sizeType}/${response["apiResponse"][0]["image_id"]}.png`;
    }
    else {
        response.fullURL = "";
    }

    return response;
}

/**
 * Devuelve información de un conjunto de portadas de videojuegos
 * @param clientID {string} ID de cliente (se encuentra en el fichero keys.json)
 * @param accessToken {string} Clave de acceso (se encuentra en el fichero keys.json)
 * @param idList {Array<number>} Lista con los ID de los videojuegos de los que se desea obtener la portada
 */
async function getCovers(clientID, accessToken, idList) {
    let url="https://api.igdb.com/v4/covers";

    if (!(idList instanceof Array)) {
        return {
            status: 400,
            statusText: "Bad Request",
            message: "idList must be an array of numbers (ex: [12, 16])"
        }
    }

    let idString = "";
    for (const id of idList) {
        idString += id + ",";
    }

    let query = `fields game,image_id; where game = (${idString.substring(0, idString.length - 1)}); limit 500;`;
    return await makeQuery(clientID, accessToken, query, url);
}

/**
 * Devuelve información sobre un videojuego para mustra en la página de información:
 * @param clientID {string} ID de cliente (se encuentra en el fichero keys.json)
 * @param accessToken {string} Clave de acceso (se encuentra en el fichero keys.json)
 * @param id {number} ID del videojuego
 */
async function getCoverAndGameInfo(clientID, accessToken, id) {
    let url = "https://api.igdb.com/v4/multiquery";

    let query = `query games "Info de Juego" {
    fields id,name,storyline,summary,first_release_date;
    where id = ${id};
};

query covers "Portada de Juego" {
    fields game,image_id;
    where game = ${id};
};`;

    return await makeQuery(clientID, accessToken, query, url);
}

/**
 * Obtiene el año de salida de una fecha de salida en formato Epoch
 * @param releaseDate {number} Fecha de salida en formato Epoch
 * @returns {number} Año de salida en formato legible
 */
function getReleaseYear(releaseDate) {
    return new Date(releaseDate * 1000).getFullYear();
}

exports.makeQuery = makeQuery;
exports.getVideogameData = getVideogameData;
exports.searchByGenreAndName = searchByGenreAndName;
exports.getCoverURL = getCoverURL;
exports.getCovers = getCovers;
exports.getCoverAndGameInfo = getCoverAndGameInfo;
exports.getReleaseYear = getReleaseYear;