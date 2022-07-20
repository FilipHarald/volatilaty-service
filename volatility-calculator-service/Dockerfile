FROM node:alpine
WORKDIR /usr/volatility-service

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY tsconfig.json .
COPY tsconfig.build.json .
COPY src ./src
RUN npm run build

CMD ["node", "./dist/index.js"]
