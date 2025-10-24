FROM node:20-alpine3.21


RUN mkdir /app
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY tsconfig.json tsconfig.json
COPY vite.config.ts vite.config.ts
COPY index.html index.html
COPY public public
COPY codegen.ts codegen.ts
COPY src src

ARG VITE_PUBLIC_STRIPE_KEY
ENV VITE_PUBLIC_STRIPE_KEY=${VITE_PUBLIC_STRIPE_KEY}

RUN npm run build

CMD ["npm", "run", "dev"]