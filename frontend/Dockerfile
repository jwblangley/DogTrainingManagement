FROM node:23

WORKDIR /dog_training_management_frontend

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY ./src ./src
COPY ./index.html ./index.html
COPY ./vite.config.js ./vite.config.js

RUN npm run build

RUN --mount=type=cache,target=/root/.npm \
    npm install --global serve

ENTRYPOINT []

EXPOSE 443

CMD ["bash", "-c", "serve -p 443 --ssl-cert $SSL_CERT_PATH --ssl-key $SSL_KEY_PATH dist"]
