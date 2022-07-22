FROM node

WORKDIR /usr/volatility-service
# Install rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain stable && \
  PATH="/root/.cargo/bin:$PATH" rustup install stable
ENV PATH $PATH:/root/.cargo/bin

COPY package.json .
COPY package-lock.json .
COPY packages ./packages
RUN npm install

COPY tsconfig.json .
COPY tsconfig.build.json .
COPY src ./src
RUN npm run build

CMD ["node", "./dist/index.js"]
