FROM node:22 AS build

WORKDIR /usr/src/app

COPY package*.json tsconfig*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

RUN npx prisma generate

COPY --from=build /usr/src/app/dist ./dist

RUN mkdir -p /usr/src/app/uploads && chown -R node:node /usr/src/app

EXPOSE 8080

USER node

CMD ["node", "dist/main.js"]