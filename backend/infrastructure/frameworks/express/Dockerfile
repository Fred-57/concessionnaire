FROM node:lts-alpine

WORKDIR /home/node/app

COPY . .

WORKDIR /home/node/app/infrastructure/frameworks/express
RUN npm install

EXPOSE 3000

CMD npm run dev
