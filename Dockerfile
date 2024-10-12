# Используем официальный образ Node.js для сборки приложения
FROM node:22 AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app


# Копируем остальные файлы приложения в контейнер
COPY . .


# Устанавливаем зависимости
RUN npm install

# Переходим в директорию maximus-client и устанавливаем зависимости
WORKDIR /app/maximus-client
RUN npm install
RUN npm run build

# Экспонируем порт 3001 для доступа к приложению
EXPOSE 3001

# Запускаем сервер
CMD ["node", "server.js"]
