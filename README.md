# Polls

Projet minimal TypeScript avec :

- un backend Express dans `backend/` ;
- un frontend Vue + Vite dans `frontend/` ;
- PostgreSQL orchestré avec Docker Compose.

## Démarrage avec Docker

```bash
docker compose up --build
```

Le frontend est disponible sur <http://localhost:8080>. Le backend expose
<http://localhost:3000/health> et la base PostgreSQL sur le port `5432`.

Le proxy Nginx du frontend redirige `/api/*` vers le backend.

## Développement local

Installer les dépendances dans chaque dossier puis lancer les serveurs :

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Pour le développement local, copier `backend/.env.example` vers `backend/.env`
et lancer PostgreSQL séparément.
