# Dockerfile pour builder le frontend Vue.js
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY app/package*.json ./
COPY shared/ ./shared
COPY app/bun.lockb ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY app/ .

# Copier le fichier .env.production (sera monté depuis le VPS)
# Le fichier sera copié depuis le VPS dans le contexte de build

# Build de l'application
RUN npm run build

# Le dossier dist/ contient les fichiers buildés
# Ces fichiers seront copiés vers le VPS après le build
