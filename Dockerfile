FROM node:alpine

RUN mkdir -p /home/node/app

WORKDIR /home/node/app
COPY . .

RUN yarn install --checkfile
RUN yarn global add tsc
RUN yarn build

CMD [ "yarn", "start" ]