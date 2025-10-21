# Stage de build
FROM node:23-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ curl unzip bash

# Installation de Bun
RUN curl -fsSL https://bun.sh/install | bash

# Ajout de Bun au PATH
ENV PATH="/root/.bun/bin:${PATH}"

ARG NODE_AUTH_TOKEN
ENV NODE_AUTH_TOKEN=${NODE_AUTH_TOKEN}


COPY back-core/package.json ./
COPY back-core/tsconfig.json ./
COPY back-core/tsconfig.build.json ./
COPY back-core/.eslintrc.js ./
COPY back-core/src ./src
COPY shared ./shared
RUN bun install



# Création du dossier uploads
RUN mkdir -p uploads

# Utilisation de Bun pour le build
RUN bun run build

FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl curl unzip bash

# Installation de Bun
RUN curl -fsSL https://bun.sh/install | bash

# Ajout de Bun au PATH
ENV PATH="/root/.bun/bin:${PATH}"

ARG NODE_AUTH_TOKEN
ENV NODE_AUTH_TOKEN=${NODE_AUTH_TOKEN}

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/package.json ./package.json
# Création du dossier uploads dans l'image de production
RUN mkdir -p uploads

# Utilisation de Bun pour installer les dépendances de production
RUN bun install --production
RUN bun add wait-on

EXPOSE 3000

# Utilisation de Bun pour exécuter le script de démarrage
CMD ["bun", "run", "start:prod"]