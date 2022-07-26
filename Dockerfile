FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --legacy-peer-deps

COPY . /usr/src/app

EXPOSE 8080
CMD ["npm", "start"]