# PeakRent - Application de Gestion Locative

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v15 ou supérieur)
- npm

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

## 📝 Scripts Disponibles

### ⚙️ Backend

```bash
cd backend
```

- `npm run test` : Lance les tests
- `npm run test:watch` : Lance les tests en mode watch
- `npm run test:postgres` : Lance les tests en mode postgres
- `npm run test:postgres:win` : Lance les tests en mode postgres sur Windows
- `npm run start` : Lance le serveur en mode production
- `npm run db:seed` : Remplit la base avec des données de test
- `npm run db:clean` : Nettoie la base de données
- `npm run db:reset` : Réinitialise la base de données
- `npm run format` : Formate le code avec Prettier
- `npm run format:check` : Vérifie le formatage du code avec Prettier
- `npm run dev` : Lance le serveur en mode développement
- `npm run lint` : Vérifie le code avec ESLint
- `npm run install` : Installe les dépendances

### 🖥️ Frontend

```bash
cd frontend
```

- `npm run dev` : Lance l'application en mode développement
- `npm run build` : Compile le projet
- `npm run lint` : Vérifie le code avec ESLint
- `npm run preview` : Prévisualise la version de production
- `npm run test` : Lance les tests
- `npm run format` : Formate le code avec Prettier
- `npm run format:check` : Vérifie le formatage du code avec Prettier
- `npm run codegen` : Génère les types TypeScript
- `npm run install` : Installe les dépendances

## 🧪 Tests

Backend :

```bash
npm run test        # Lance tous les tests
npm run test:watch  # Lance les tests en mode watch
npm run test:postgres  # Lance les tests en mode postgres
npm run test:postgres:win  # Lance les tests en mode postgres sur Windows
```

Frontend :

```bash
npm run test        # Lance tous les tests
```

## 🔍 Linting et Formatting

```bash
npm run lint        # Vérifie le code
npm run format      # Formate le code
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
