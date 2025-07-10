# 前端开发热部署Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "start"] 