# Instrucciones de uso de la API #
Para utilizar las funcionalidades relacionadas con la API de IGDB es necesario seguir estas instrucciones
1. Copiar el archivo con las claves de la API ```keys.json``` al directorio ```backend/api```
```
backend/
├── api
│   ├── api.cjs
│   └── keys.json <-- Fichero con las claves de la API
├── docs
│   ├── docs.html
│   └── spec.yaml
├── express.js
└── README.md

```

2. Instalar los paquetes necesarios con npm.
```
npm install
```
Este paso no es necesario hacerlo si ya se han instalado los paquetes previamente.
Los paquetes relacionados con la API son [express](https://www.npmjs.com/package/express) y [cors](https://www.npmjs.com/package/cors).

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
Una vez hecho esto ya deberían funcionar las funcionalidades de la API en la página.
