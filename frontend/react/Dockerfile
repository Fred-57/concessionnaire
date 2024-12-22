FROM node:lts-alpine

WORKDIR /home/node/app

COPY . .

WORKDIR /home/node/app/react
RUN npm install

EXPOSE 8080

CMD npm run dev
