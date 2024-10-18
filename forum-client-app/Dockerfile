FROM node:20
WORKDIR /app
COPY . . 

# Устанавливаем зависимости
RUN npm install

RUN npm run build
CMD ["npm", "start"]