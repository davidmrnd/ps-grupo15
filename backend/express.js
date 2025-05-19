const express = require('express');
const cors = require('cors');
const deepl = require('deepl-node');

const apiFunctions = require('./api/api.cjs');
const igdbKeys = require('./api/igdb_keys.json');
const translationKeys = require('./api/deepl_key.json');
const genreSpanishTranslations = require('./api/i18n/es.json');

const app = express();
const port = 4000;

const deeplClient = new deepl.DeepLClient(translationKeys.key);

app.use(express.json());
app.use(cors());

genreTranslations = {
  "es": genreSpanishTranslations
}

app.get('/', (req, res) => {
    res.status(418).send('GameCritic backend working');
});

app.post('/query', (req, res) => {
    apiFunctions.makeQuery(
        igdbKeys["client-id"],
        igdbKeys["access-token"],
        req.body["query"],
        req.body["url"]
    )
        .then(result => {
            res.status(result.status).send(result);
        });
});

app.get('/get-game/:id', (req, res) => {
    apiFunctions.getVideogameData(
        igdbKeys["client-id"],
        igdbKeys["access-token"],
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
            igdbKeys["client-id"],
            igdbKeys["access-token"],
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
            igdbKeys["client-id"],
            igdbKeys["access-token"],
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
        igdbKeys["client-id"],
        igdbKeys["access-token"],
        req.body.idList
    )
        .then(result => {
            res.status(result.status).send(result);
        });
});

app.get('/get-game-profile/:id', (req, res) => {
    apiFunctions.getCoverAndGameInfo(
        igdbKeys["client-id"],
        igdbKeys["access-token"],
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
        igdbKeys["client-id"],
        igdbKeys["access-token"],
        req.params.slug,
      )
        .then((result) => {
            res.status(result.status).send(result);
        });
});

app.post('/get-videogame-info-from-id-list', (req, res) => {
    apiFunctions.getVideogameInfoFromIdList(
      igdbKeys["client-id"],
      igdbKeys["access-token"],
      req.body.idList
    )
      .then(result => {
          res.status(result.status).send(result);
      });
});

app.post('/get-platform-names-from-id-list', (req, res) => {
    apiFunctions.getPlatformNamesFromIdList(
      igdbKeys["client-id"],
      igdbKeys["access-token"],
      req.body.idList,
      "platforms"
    )
      .then(result => {
        res.status(result.status).send(result);
      });
});

app.post('/get-genre-names-from-id-list', (req, res) => {
    apiFunctions.getPlatformNamesFromIdList(
      igdbKeys["client-id"],
      igdbKeys["access-token"],
      req.body.idList,
      "genres"
    )
      .then(result => {
        res.status(result.status).send(result);
      });
});

app.post('/get-genre-and-platform-names-from-id-lists', (req, res) => {
    apiFunctions.getPlatformAndGenreNamesFromIdLists(
      igdbKeys["client-id"],
      igdbKeys["access-token"],
      req.body.genreIdList,
      req.body.platformIdList
    )
      .then(result => {
        res.status(result.status).send(result);
      });
});

app.post('/translate/:language', (req, res) => {
    deeplClient.translateText(req.body.text, "en", req.params.language)
      .then(result => {
        res.status(200).send({
          status: 200,
          statusText: 'OK',
          translatedText: result.text
        });
      })
      .catch(err => {
        res.status(400).send({
          status: 400,
          statusText: 'Bad Request',
          message: err.message
        })
      });
});

app.post('/translate-genres/:language', (req, res) => {
    const language = req.params.language;
    const currentLanguageTranslations = genreTranslations[language];

    const genreList = req.body.genreList;

    if (!currentLanguageTranslations) {
      res.status(404).send({
        status: 404,
        statusText: 'Not Found',
        message: 'Language is invalid or not available.'
      });
    }

    else if(!(genreList instanceof Array)) {
      res.status(400).send({
        status: 400,
        statusText: 'Bad Request',
        message: "genreList must be an array. Example: ['Adventure', 'Shooter']"
      });
    }

    else {
      const translatedGenres = [];
      for (const genre of genreList) {
        const currentTranslation = genreSpanishTranslations[genre];
        if (currentTranslation) {
          translatedGenres.push(currentTranslation);
        }
      }
      res.status(200).send({
        status: 200,
        statusText: 'OK',
        translatedGenres: translatedGenres
      });
    }
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
