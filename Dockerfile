FROM node:22.14.0-alpine3.21
ARG APP_DIR=app
WORKDIR ${APP_DIR}

COPY package*.json ./
RUN npm install

COPY . .
CMD ["node", "main.js"]
