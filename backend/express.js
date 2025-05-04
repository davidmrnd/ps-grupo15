const express = require('express');
const cors = require('cors');
const apiFunctions = require('./api/api.cjs');
const keys = require('./api/keys.json');
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(418).send('GameCritic backend working');
});

app.post('/query', (req, res) => {
    apiFunctions.makeQuery(
        keys["client-id"],
        keys["access-token"],
        req.body["query"],
        req.body["url"]
    )
        .then(result => {
            res.status(result.status).send(result);
        });
});

app.get('/get-game/:id', (req, res) => {
    apiFunctions.getVideogameData(
        keys["client-id"],
        keys["access-token"],
        req.params.id,
    )
        .then(result => {
            res.status(result.status).send(result);
        });
});

app.post('/search', (req, res) => {
    const limit = req.body.limit;

    if (!limit) {
        res.status(400).send({
            status: 400,
            statusText: 'Bad Request',
            message: "Limit not specified"
        });
    }
    else {
        apiFunctions.searchByGenreAndName(
            keys["client-id"],
            keys["access-token"],
            req.body["limit"],
            req.body["query"],
            req.body["genreList"],
        )
            .then(result => {
                res.status(result.status).send(result);
            });
    }
});

app.get('/cover/:id/:sizeType', (req, res) => {
    const sizeType = [
        "cover_small",
        "screenshot_med",
        "cover_big",
        "logo_med",
        "screenshot_big",
        "screenshot_huge",
        "thumb",
        "micro",
        "720p",
        "1080p",
    ];

    if (!sizeType.includes(req.params.sizeType)) {
        res.status(400).send({
            status: 400,
            statusText: 'Bad Request',
            message: "sizeType is not valid. Available sizeType: https://api-docs.igdb.com/#images"
        });
    }
    else {
        apiFunctions.getCoverURL(
            keys["client-id"],
            keys["access-token"],
            req.params.id,
            req.params.sizeType
        )
            .then(result => {
                res.status(result.status).send(result);
            });
    }
});

app.post('/covers', (req, res) => {
    apiFunctions.getCovers(
        keys["client-id"],
        keys["access-token"],
        req.body.idList
    )
        .then(result => {
            res.status(result.status).send(result);
        });
});

app.get('/get-game-profile/:id', (req, res) => {
    apiFunctions.getCoverAndGameInfo(
        keys["client-id"],
        keys["access-token"],
        req.params.id,
    )
        .then(result => {
            res.status(result.status).send(result);
        });
});

app.get('/release-year/:releaseDate', (req, res) => {
    const releaseDate = req.params.releaseDate;
    if (isNaN(releaseDate)) {
        res.status(400).send({
            status: 400,
            statusText: 'Bad Request',
            message: "Release Date is invalid"
        });
    }
    else {
        const releaseYear = apiFunctions.getReleaseYear(releaseDate);
        res.status(200).send({
            status: 200,
            statusText: 'OK',
            releaseYear: releaseYear
        });
    }
});

app.get('/get-videogame-profile-from-slug/:slug', (req, res) => {
    apiFunctions.getVideogameProfileFromSlug(
        keys["client-id"],
        keys["access-token"],
        req.params.slug,
      )
        .then((result) => {
            res.status(result.status).send(result);
        });
});

app.post('/get-videogame-info-from-id-list', (req, res) => {
    apiFunctions.getVideogameInfoFromIdList(
      keys["client-id"],
      keys["access-token"],
      req.body.idList
    )
      .then(result => {
          res.status(result.status).send(result);
      });
});

app.post('/get-platform-names-from-id-list', (req, res) => {
    apiFunctions.getPlatformNamesFromIdList(
      keys["client-id"],
      keys["access-token"],
      req.body.idList,
      "platforms"
    )
      .then(result => {
        res.status(result.status).send(result);
      });
});

app.post('/get-genre-names-from-id-list', (req, res) => {
    apiFunctions.getPlatformNamesFromIdList(
      keys["client-id"],
      keys["access-token"],
      req.body.idList,
      "genres"
    )
      .then(result => {
        res.status(result.status).send(result);
      });
});

app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/docs/docs.html');
});

app.get('/docs/spec', (req, res) => {
  res.sendFile(__dirname + '/docs/spec.yaml');
});

app.listen(port, () => {
    console.log(`GameCritic backend listening on port ${port}`)
    console.log(`Backend Documentation available at http://localhost:${port}/docs`)
});
