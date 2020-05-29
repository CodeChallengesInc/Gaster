FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir /ants
EXPOSE 3000
CMD ["npm", "run app"]