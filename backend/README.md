# Instrucciones de uso de la API #
Para utilizar las funcionalidades relacionadas con la API de IGDB y de traducción con DeepL es necesario seguir estas instrucciones
1. Eliminar el fichero ```keys.json``` si no está eliminado
2. Copiar los archivos con las claves de las APIs ```deepl_key.json``` y ```igdb_keys.json``` al directorio ```backend/api```
```
backend/
├── api
│   ├── api.cjs
│   ├── deepl_key.json <-- Fichero con la clave de la API de DeepL
│   ├── i18n
│   │   └── genres_es.json
│   └── igdb_keys.json <-- Fichero con las claves de la API de IGDB
├── docs
│   ├── docs.html
│   └── spec.yaml
├── express.js
└── README.md
```

3. Instalar los paquetes necesarios con npm.
```
npm install
```
Este paso no es necesario hacerlo si ya se han instalado los paquetes previamente.

Los paquetes relacionados con la API son [express](https://www.npmjs.com/package/express), [cors](https://www.npmjs.com/package/cors) y [deepl_node](https://www.npmjs.com/package/deepl-node).

3. Arrancar el backend con npm.
```
npm run start-backend
```
Cuando este arranque se verá en pantalla algo parecido a esto
```
> game-critic-angular@0.0.0 start-backend
> node backend/express.js

GameCritic backend listening on port 4000
Backend Documentation available at http://localhost:4000/docs
```
Una vez hecho esto ya deberían funcionar las funcionalidades de las APIs en la página.
