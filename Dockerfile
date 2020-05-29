FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir /ants
EXPOSE 3000
RUN npm run tsc
CMD ["node", "./build/app.js"]