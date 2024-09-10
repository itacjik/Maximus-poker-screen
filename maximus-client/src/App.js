import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("image", file);

    axios
      .post("/upload", formData)
      .then((res) => setMessage(res.data))
      .catch((err) => setMessage("Ошибка загрузки"));
  };

  return (
    <div>
      <h1>Загрузить изображение</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Загрузить</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
