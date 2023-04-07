# syntax=docker/dockerfile:1
   
FROM node:19.7.0

WORKDIR /app

COPY ./src /app

RUN npm install 

CMD ["node", "index.js"]
