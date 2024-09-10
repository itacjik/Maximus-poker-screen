const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// Загрузка изображений
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send("Нет файла");
  res.send(`Файл загружен: ${req.file.filename}`);
});

// Раздача статических файлов (картинки)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Раздача React-приложения
app.use(express.static(path.join(__dirname, "maximus-client/build")));

// Запуск сервера
app.listen(3000, () => {
  console.log("Сервер запущен на http://localhost:3000");
});
