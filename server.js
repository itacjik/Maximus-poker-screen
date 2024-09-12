const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// API для загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('Нет файла');
  res.send(`Файл загружен: ${req.file.filename}`);
});

// Раздача статических файлов (загруженные изображения)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Раздача административной панели (React)
app.use('/admin', express.static(path.join(__dirname, 'maximus-client/build')));
app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, 'maximus-client/build', 'index.html'));
});

// Раздача основной страницы (React)
app.use(express.static(path.join(__dirname, 'maximus-client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'maximus-client/build', 'index.html'));
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
