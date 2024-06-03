FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir /ants
EXPOSE 3000
RUN npm run tsc
RUN ls
RUN ls build
CMD ["node", "./build/src/app.js"]