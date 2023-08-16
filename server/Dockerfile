FROM node:19.9-alpine

ADD ./ /app
WORKDIR /app

ENV NODE_ENV="development"

RUN npm install -g sequelize-cli nodemon
RUN npm install

CMD [ "nodemon", "--inspect=0.0.0.0:9220", "-L", "bin/www" ]

