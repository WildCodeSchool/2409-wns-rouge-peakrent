# 📖 Complete Documentation – **PeakRent**

## 🔥 Overview

**PeakRent** is a modern rental management web application for sports equipment:

- Backend: **Node.js + TypeScript + TypeGraphQL + TypeORM**
- Frontend: **React + Vite + Shadcn/ui**
- API: **GraphQL** (primary) + **REST for image uploads**
- Authentication: **JWT**
- Database: **PostgreSQL**
- Infrastructure: **Docker / Docker Compose / Private DockerHub / Caddy / Nginx**
- CI/CD: **GitHub Actions + OVH auto-deploy webhook**

---

## 📦 Prerequisites

- Docker + Docker Compose
- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL ≥ 15
- DockerHub (private access)
- OVH Linux server (reverse proxy + webhook)

---

## 🧱 Key technologies

### Backend:

- **Node.js / TypeScript**
- **TypeORM**
- **TypeGraphQL + Apollo Server**
- JWT authentication
- Minimal REST endpoint for upload (`multer` + `sharp`)

### Frontend:

- **React + Vite**
- **shadcn/ui** (Radix UI + design system)
- **Apollo Client**
- **graphql-codegen**
- UI: Tailwind CSS, lucide-react, Zod for validation

---

## 🐋 Docker & Docker Compose

### Main containers:

- `frontend`: React app (port 3000)
- `backend`: GraphQL API + REST (port 4000)
- `db`: PostgreSQL (port 5432)
- `nginx`: reverse proxy (port 80)
- `caddy`: HTTPS in staging/prod (port 443)

### Docker Compose:

- Compose files:

  - `compose.yaml`: Production
  - `compose.dev.yaml`: Local development
  - `compose.staging.yaml`: Staging (webhook-ready)

- Persistent volumes:

  - `db-data`: PostgreSQL data

---

## 🔒 Reverse proxy: Caddy + Nginx

### `nginx.conf`:

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

👉 **Nginx is used for local/dev routing**
👉 **Caddy is used in staging/prod for automated HTTPS with Let's Encrypt**

---

## 🔧 Frontend Codegen

- `graphql-codegen` configured (`npm run codegen`):

  - Generates TypeScript types from backend schema
  - Automatically generates type-safe React hooks (Apollo Client)

---

## 🔨 CI/CD with GitHub Actions

### Workflows:

- `ci-build-develop.yml`:

  - Build + test + push Docker image for `develop` branch

- `ci-build-main.yml`:

  - Build + test + push Docker image for `main` branch
  - **Auto-deployment webhook to OVH server**

### Secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `WEBHOOK_SECRET` (optional)

---

## 📡 OVH Deployment

### Workflow:

1️⃣ Push to `main` ➡️ `ci-build-main.yml`:

- Build `frontend` + `backend`
- Push private DockerHub image
- Call webhook for auto-pull on OVH server

2️⃣ OVH server:

- `docker-compose pull`
- `docker-compose up -d`
- `caddy` reverse proxy exposes services over HTTPS

---

## 🔑 Authentication & API

- JWT access + refresh tokens
- GraphQL API `/api/graphql`
- REST uploads `/api/uploads` (product images)

---

## 📄 License

MIT
See `LICENSE`.

---

## 🚀 Improvement roadmap:

- ☑️ OpenTelemetry / Prometheus monitoring
- ☑️ Dockerized e2e tests (Playwright/Cypress)
- ☑️ Centralized logging
- ☑️ DB index/performance optimization

---

## 🔧 Configuration

1️⃣ Set up environment variables:

- Create `.env` at the backend root
  Copy from `.env.example` and adjust for your environment

- Create `database.env` at project root
  Copy from `database.env.example` and adjust

- Create `variables.env` at project root
  Copy from `variables.env.example` and adjust

---

## 📦 Installation

Run the project with Docker Compose:

```bash
docker compose -f compose.dev.yaml up --build
```

Stop and remove containers:

```bash
docker compose -f compose.dev.yaml down -v
```

Reset database:

```bash
docker compose exec backend npm run db:reset
```

Seed database:

```bash
docker compose exec backend npm run db:seed
```

Clean database:

```bash
docker compose exec backend npm run db:clean
```

Access PostgreSQL database:

```bash
docker compose exec db psql -U peakrent -d peakrent
```

---

## ⚙️ Useful scripts

### Backend:

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

### Frontend:

```bash
npm run dev         # Dev mode
npm run build       # Production build
npm run preview     # Local preview
npm run lint        # ESLint
npm run test        # Vitest unit tests
npm run format      # Prettier format
npm run codegen     # ⚡ GraphQL Codegen
```
