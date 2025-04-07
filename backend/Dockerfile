FROM node:20-alpine3.21

RUN mkdir /app
RUN apk add --no-cache bash netcat-openbsd

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src
COPY seed seed
# COPY seed.sql /docker-entryoint-initdb.d/
COPY wait-for-db.sh wait-for-db.sh
# RUN chmod +x wait-for-db.sh

# RUN npm install -D ts-node typescript

# ENTRYPOINT ["/bin/bash", "-c"]
CMD ["npm", "start"]