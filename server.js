const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Настраиваем multer для увеличения лимитов размера загружаемых файлов
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // Устанавливаем лимит на размер файла (50MB)
  },
});

// Увеличиваем лимиты для JSON данных и URL-кодированных данных
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API для загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('Нет файла');
  res.send(`Файл загружен: ${req.file.filename}`);
});

// API для сохранения данных (стили, позиции и т.д.)
app.post('/save-data', (req, res) => {
  const data = req.body; // Данные от клиента (стили и позиции)
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8'); // Сохранение в файл
  res.send('Данные успешно сохранены');
});

// API для получения сохраненных данных
app.get('/get-data', (req, res) => {
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json', 'utf-8');
    res.json(JSON.parse(data));
  } else {
    res.json(null); // Если данных нет, возвращаем null
  }
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
app.listen(3001, () => {
  console.log('Сервер запущен на http://localhost:3001');
});

