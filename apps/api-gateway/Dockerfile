FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci 

COPY . .

RUN npm run build api-gateway

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "--enable-source-maps", "dist/apps/api-gateway/main.js"]