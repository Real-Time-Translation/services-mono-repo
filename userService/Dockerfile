FROM node:16
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --only=production
COPY ./src ./src
CMD npm run build
CMD npm start

