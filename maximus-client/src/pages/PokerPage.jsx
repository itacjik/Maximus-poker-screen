import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd"; // Для управления позициями элементов
import "../styles/styles.css";

// Функция загрузки данных с сервера
const loadDataFromServer = async () => {
  const response = await fetch("/get-data");
  const data = await response.json();
  return data;
};

const PokerPage = () => {
  const [tables, setTables] = useState([]); // Данные таблиц
  const [styles, setStyles] = useState({}); // Данные стилей

  // Загружаем сохраненные данные при загрузке страницы
  useEffect(() => {
    const loadData = async () => {
      const savedData = await loadDataFromServer();
      if (savedData) {
        setTables(savedData.tables); // Устанавливаем таблицы
        setStyles(savedData.styles); // Устанавливаем стили
      }
    };
    loadData();
  }, []);

  return (
    <div className="main-screen">
      {tables.map((table, tableIndex) => (
        <Rnd
          key={tableIndex}
          size={{ width: table.size.width, height: table.size.height }} // Задание размера таблицы
          position={{ x: table.position.x, y: table.position.y }} // Задание позиции таблицы
          disableDragging={true} // Отключаем возможность перемещения
          enableResizing={false} // Отключаем изменение размера
          bounds="parent"
          style={{
            border: "1px solid #000",
            backgroundColor: `${styles.bgColor || "#ffffff"}99`,
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <div>
            {/* Заголовок таблицы */}
            <h1
              className="mt-3"
              style={{
                fontFamily: styles.fontFamily,
                color: styles.fontColorHeader,
                fontSize: `${styles.titleFontSize}px`,
                fontWeight: styles.isBold ? "bold" : "normal",
                textShadow: `2px 2px 4px ${styles.shadowColorTitle}`,
              }}
            >
              {table.title}
            </h1>

            {/* Таблица */}
            <table className="mx-2">
              <thead>
                <tr>
                  {table.headers.map((header, columnIndex) => (
                    <th
                      key={columnIndex}
                      scope="col"
                      style={{
                        fontFamily: styles.fontFamily,
                        color: styles.fontColorColumn,
                        fontSize: `${styles.headerFontSize}px`,
                        fontWeight: styles.isBold ? "bold" : "normal",
                        textShadow: `2px 2px 4px ${styles.shadowColorHeader}`,
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((columnKey, columnIndex) => (
                      <td
                        key={columnIndex}
                        style={{
                          fontFamily: styles.fontFamily,
                          fontSize: `${styles.contentFontSize}px`,
                          color: styles.fontColorContent,
                          fontWeight: styles.isBold ? "bold" : "normal",
                        }}
                      >
                        {row[columnKey]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default PokerPage;
