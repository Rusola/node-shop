FROM node:12-alpine
WORKDIR /node-resful-shop
COPY . .
RUN yarn install --production
CMD ["node", "server.js"]