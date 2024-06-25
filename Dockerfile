FROM node:18 As development

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

FROM node:18 As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node . .

COPY --from=development /usr/src/app/node_modules ./node_modules

RUN npm install

RUN npm run build

USER node

FROM node:18 As production
WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
