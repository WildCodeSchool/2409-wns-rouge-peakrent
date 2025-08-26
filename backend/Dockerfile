FROM node:20-alpine3.21

RUN mkdir /app

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm cache clean -f
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src
COPY seed seed

CMD ["npm", "start"]