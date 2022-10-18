FROM node:alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npx prisma migrate deploy

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
