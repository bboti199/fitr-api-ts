FROM node:12 AS development

WORKDIR /app

COPY ./package.json ./
COPY yarn.lock ./

RUN yarn install --only=development

COPY . .

RUN yarn run build

FROM node:12 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /app ./dist

EXPOSE 3000

CMD ["yarn", "run", "start:prod"]