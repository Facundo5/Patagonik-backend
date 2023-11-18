FROM node:16

WORKDIR /PatagoikServer
COPY package.json .
RUN npm install
COPY . .
CMD npm start