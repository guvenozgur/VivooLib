FROM node:12.18.3
WORKDIR /usr/src/app/vivo-lib-server
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "./src/server.js" ]
