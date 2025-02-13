FROM node:20-alpine3.21

RUN mkdir /app
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src
# COPY seed.sql /docker-entryoint-initdb.d/

# ENTRYPOINT ["/bin/bash", "-c"]
CMD ["npm", "start"]