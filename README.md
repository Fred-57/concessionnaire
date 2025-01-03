# concessionnaire

## Installation

### Installer les dépendances du frontend

```sh
cd frontend/ && npm install
```

### Installer les dépendances du backend

```sh
cd backend/ && npm install
```

> [!IMPORTANT]  
> Le backend utilise les workspaces de Node.js afin de permettre aux différents projets Node.js (frameworks, repositories...) de s'importer entre eux. L'ensemble des dépendances (`node_modules`) sont installées dans le répertoire `backend`.

### Installer une dépendance dans un workspace

Il est préférable d'effectuer l'installation depuis le répertoire `backend` :

```sh
npm i dotenv -w @triumph/postgres
```

## Exécution

Lancer la ou les bases de données à l'aide de Docker Compose :

```sh
docker compose up -d
```

Puis lancer les frameworks frontend et backend à l'aide d'une installation Node.js locale :

```sh
cd backend && npm run express:dev
```

```sh
cd frontend/react && npm i && npm run dev
```
