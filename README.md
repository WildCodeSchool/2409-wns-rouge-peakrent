# 📖 Documentation complète – **PeakRent**

## 🔥 Présentation

**PeakRent** est une application moderne de gestion locative de matériel sportif :

- Backend : **Node.js + TypeScript + TypeGraphQL + TypeORM**
- Frontend : **React + Vite + Shadcn/ui**
- API : **GraphQL** (principal) + **REST pour upload d’images**
- Authentification : **JWT**
- Base de données : **PostgreSQL**
- Infrastructure : **Docker / Docker Compose / DockerHub privé / Caddy / Nginx**
- CI/CD : **GitHub Actions + webhook auto-déploiement OVH**

---

## 📦 Prérequis

- Docker + Docker Compose
- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL ≥ 15
- DockerHub (accès privé)
- Serveur OVH Linux (reverse proxy + webhook)

---

## 📂 Structure du projet

```
peakrent/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── entities/
│   │   ├── resolvers/
│   │   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── seed/
│   ├── uploads/
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/
│   ├── Dockerfile
│   └── graphql.config.ts (codegen)
├── docker/
│   ├── compose.yaml
│   ├── compose.dev.yaml
│   ├── compose.staging.yaml
│   └── nginx.conf
├── .github/workflows/
│   ├── ci-build-main.yml
│   ├── ci-build-develop.yml
│   └── main.yml
└── README.md (📖 ce fichier)
```

---

## 🧱 Technologies clés

### Backend :

- **Node.js / TypeScript**
- **TypeORM**
- **TypeGraphQL + Apollo Server**
- Authentification JWT
- REST minimal pour upload (`multer` + `sharp`)

### Frontend :

- **React + Vite**
- **shadcn/ui** (Radix UI + Design system)
- **Apollo Client**
- **graphql-codegen**
- UI : Tailwind CSS, lucide-react, Zod pour validation

---

## 🐋 Docker & Docker Compose

### Conteneurs principaux :

- `frontend`: React app (port 3000)
- `backend`: API GraphQL + REST (port 4000)
- `db`: PostgreSQL (port 5432)
- `nginx`: reverse proxy (port 80)
- `caddy`: HTTPS en staging/prod (port 443)

### Docker Compose :

- Compose files :

  - `compose.yaml` : Prod
  - `compose.dev.yaml` : Dev local
  - `compose.staging.yaml` : Staging (webhook-ready)

- Volumes persistants :

  - `db-data`: PostgreSQL data

---

## 🔒 Reverse proxy : Caddy + Nginx

### `nginx.conf` :

```nginx
events {}

http {
    server {
        listen 80;

        location /api {
            proxy_pass http://backend:4000;
        }

        location / {
            proxy_pass http://frontend:3000;
        }
    }
}
```

👉 **Nginx utilisé pour le routage local/dev**
👉 **Caddy en staging/prod : HTTPS auto avec Let's Encrypt**

---

## 🔧 Codegen frontend

- `graphql-codegen` configuré (`npm run codegen`) :

  - Types TypeScript à partir du schéma backend
  - Génère automatiquement les hooks React (Apollo Client) type-safe

---

## 🔨 CI/CD avec GitHub Actions

### Workflows :

- `ci-build-develop.yml` :

  - Build + test + push image Docker `develop`

- `ci-build-main.yml` :

  - Build + test + push image Docker `main`
  - **Webhook auto-déploiement vers serveur OVH**

### Secrets :

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `WEBHOOK_SECRET` (optionnel)

---

## 📡 Déploiement OVH

### Workflow :

1️⃣ Push `main` ➡️ `ci-build-main.yml` :

- Build `frontend` + `backend`
- Push DockerHub privé
- Appel webhook auto-pull sur OVH

2️⃣ Serveur OVH :

- `docker-compose pull`
- `docker-compose up -d`
- Reverse proxy `caddy` expose en HTTPS

---

## 🔑 Authentification & API

- JWT Access + Refresh tokens
- GraphQL API `/api/graphql`
- REST uploads `/api/uploads` (images produits)

---

## 📄 Licences

MIT
Voir `LICENSE`.

---

## 🚀 Roadmap améliorations :

- ☑️ Monitoring OpenTelemetry / Prometheus
- ☑️ Tests e2e Dockerisés (Playwright/Cypress)
- ☑️ Logs centralisés
- ☑️ Optimisation DB index/perf

---

## 🔧 Configuration

1. Configurer la base des variables d'environnement :

- Créer un fichier `.env` à la racine du dossier backend
- Copier le contenu de `.env.example` et ajuster les variables selon votre environnement

- Créer le fichier `database.env` à la racine du projet
- Copier le contenu de `database.env.example` et ajuster les variables selon votre environnement

- Créer le fichier `variables.env` à la racine du projet
- Copier le contenu de `variables.env.example` et ajuster les variables selon votre environnement

## 📦 Installation

Lancer le projet avec docker compose :

```bash
docker compose -f compose.dev.yaml up --build
```

Supprimer le conteneur :

```bash
docker compose -f compose.dev.yaml down -v
```

Reset la base de données :

```bash
docker compose exec backend npm run db:reset
```

Remplir la base de données :

```bash
docker compose exec backend npm run db:seed
```

Clean la base de données :

```bash
docker compose exec backend npm run db:clean
```

Se connecter à la base de données :

```bash
docker compose exec db psql -U peakrent -d peakrent
```

## ⚙️ Scripts utiles

### Backend :

```bash
npm run dev         # Dev mode
npm run start       # Prod mode
npm run test        # Jest tests
npm run test:watch  # Watch tests
npm run lint        # ESLint
npm run format      # Prettier format
npm run db:seed     # Seed DB
npm run db:clean    # Clean DB
npm run db:reset    # Reset DB (clean + seed)
```

### Frontend :

```bash
npm run dev         # Dev mode
npm run build       # Build prod
npm run preview     # Local preview
npm run lint        # ESLint
npm run test        # Vitest unit tests
npm run format      # Prettier format
npm run codegen     # ⚡ GraphQL Codegen
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
