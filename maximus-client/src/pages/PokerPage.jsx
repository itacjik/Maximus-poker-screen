import React, { useState, useEffect, useRef } from "react";
import "../styles/PokerPage.css";

// Функции для сохранения и загрузки данных
const saveDataToServer = async (data) => {
  await fetch("/save-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const loadDataFromServer = async () => {
  const response = await fetch("/get-data");
  const data = await response.json();
  return data;
};

// Данные для таблицы
const pokerData = [
  { limits: "1$/2$", rake: "5%", cap: "-", minBuyIn: "100$" },
  { limits: "2$/5$", rake: "5%", cap: "75$", minBuyIn: "200$" },
  { limits: "5$/5$", rake: "5%", cap: "75$", minBuyIn: "300$" },
  { limits: "5$/10$", rake: "4%", cap: "100$", minBuyIn: "500$" },
  { limits: "10$/25$", rake: "3%", cap: "100$", minBuyIn: "1000$" },
  { limits: "25$/25$", rake: "3%", cap: "125$", minBuyIn: "2000$" },
  { limits: "25$/50$", rake: "2%", cap: "200$", minBuyIn: "3000$" },
];

const PokerPage = () => {
  const draggableRef = useRef(null);  // Ссылка на перетаскиваемый элемент

  const [isEditing, setIsEditing] = useState(false);   // Режим редактирования
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
  const [elementSize, setElementSize] = useState({ width: 400, height: 300 });
  const [styles, setStyles] = useState({
    headerFontSize: 24,
    headerColor: "#000000",
    tableColor: "#ffffff",
    textFontSize: 16,
    textColor: "#000000",
    bgColor: "#ffffff",
  });

  // Загрузка данных с сервера при загрузке страницы
  useEffect(() => {
    const loadData = async () => {
      const savedData = await loadDataFromServer();
      if (savedData) {
        setStyles(savedData.styles);
        setElementPosition(savedData.position);
        setElementSize(savedData.size);
      }
    };
    loadData();
  }, []);

  // Сохранение данных на сервер
  const saveChanges = async () => {
    const dataToSave = {
      styles,
      position: elementPosition,
      size: elementSize,
    };
    await saveDataToServer(dataToSave);
    setIsEditing(false);
  };

  // Функция для перетаскивания
  const handleMouseDown = (e) => {
    if (!isEditing) return;
    const rect = draggableRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    const handleMouseMove = (e) => {
      setElementPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="poker-screen">
      <div style={{ marginBottom: "20px" }}>
        <h2>Настройки стилей:</h2>
        <label>
          Режим редактирования:
          <input
            type="checkbox"
            checked={isEditing}
            onChange={(e) => setIsEditing(e.target.checked)}
          />
        </label>
        {isEditing && (
          <>
            <br />
            <label>Размер шрифта заголовка: {styles.headerFontSize}px</label>
            <input
              type="range"
              name="headerFontSize"
              min="16"
              max="72"
              value={styles.headerFontSize}
              onChange={(e) =>
                setStyles({ ...styles, headerFontSize: e.target.value })
              }
            />
            <br />
            <label>Цвет заголовка:</label>
            <input
              type="color"
              name="headerColor"
              value={styles.headerColor}
              onChange={(e) =>
                setStyles({ ...styles, headerColor: e.target.value })
              }
            />
            <br />
            <label>Цвет таблицы:</label>
            <input
              type="color"
              name="tableColor"
              value={styles.tableColor}
              onChange={(e) =>
                setStyles({ ...styles, tableColor: e.target.value })
              }
            />
            <br />
            <label>Размер шрифта текста: {styles.textFontSize}px</label>
            <input
              type="range"
              name="textFontSize"
              min="12"
              max="36"
              value={styles.textFontSize}
              onChange={(e) =>
                setStyles({ ...styles, textFontSize: e.target.value })
              }
            />
            <br />
            <label>Цвет текста:</label>
            <input
              type="color"
              name="textColor"
              value={styles.textColor}
              onChange={(e) =>
                setStyles({ ...styles, textColor: e.target.value })
              }
            />
            <br />
            <label>Цвет фона блока:</label>
            <input
              type="color"
              name="bgColor"
              value={styles.bgColor}
              onChange={(e) => setStyles({ ...styles, bgColor: e.target.value })}
            />
            <br />
            <button onClick={saveChanges}>Сохранить изменения</button>
          </>
        )}
      </div>

      <div
        ref={draggableRef}
        className="draggable"
        style={{
          position: "absolute",
          left: `${elementPosition.x}px`,
          top: `${elementPosition.y}px`,
          width: `${elementSize.width}px`,
          height: `${elementSize.height}px`,
          backgroundColor: styles.bgColor,
          border: "1px solid black",
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{ padding: "10px" }}>
          <h1
            className="header"
            style={{
              fontSize: `${styles.headerFontSize}px`,
              color: styles.headerColor,
            }}
          >
            TEXAS & OMAHA
          </h1>
          <table className="table" style={{ backgroundColor: styles.tableColor }}>
            <thead>
              <tr>
                <th scope="col">Limits</th>
                <th scope="col">Rake</th>
                <th scope="col">Cap</th>
                <th scope="col">Min Buy In</th>
              </tr>
            </thead>
            <tbody>
              {pokerData.map((row, index) => (
                <tr key={index}>
                  <td style={{ fontSize: `${styles.textFontSize}px`, color: styles.textColor }}>
                    {row.limits}
                  </td>
                  <td style={{ fontSize: `${styles.textFontSize}px`, color: styles.textColor }}>
                    {row.rake}
                  </td>
                  <td style={{ fontSize: `${styles.textFontSize}px`, color: styles.textColor }}>
                    {row.cap}
                  </td>
                  <td style={{ fontSize: `${styles.textFontSize}px`, color: styles.textColor }}>
                    {row.minBuyIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PokerPage;
