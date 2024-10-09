import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "../styles/styles.css";

const loadDataFromServer = async () => {
  const response = await fetch("/get-data");
  const data = await response.json();
  return data;
};

const AdminPage = () => {
  const [tables, setTables] = useState([]);
  const [styles, setStyles] = useState({
    fontFamily: "Arial",
    titleFontSize: 36,
    headerFontSize: 24,
    contentFontSize: 16,
    fontColorHeader: "#000000",
    fontColorColumn: "#000000",
    fontColorContent: "#000000",
    isBold: false,
    backgroundImage: "",
    overlayOpacity: 0.5,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [previousTables, setPreviousTables] = useState([]);
  const [previousStyles, setPreviousStyles] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const savedData = await loadDataFromServer();
      if (savedData) {
        setTables(savedData.tables);
        setStyles(savedData.styles);
      }
    };
    loadData();
  }, []);

  const addNewTable = () => {
    setTables([
      ...tables,
      {
        title: `Table ${tables.length + 1}`,
        headers: ["Limits", "Rake", "Cap", "Min Buy In"],
        rows: [{ limits: "1$/2$", rake: "5%", cap: "-", minBuyIn: "100$" }], // Изначальные строки
        position: { x: 150, y: 150 },
        size: { width: 400, height: 200 },
      },
    ]);
  };

  const removeTable = (tableIndex) => {
    const updatedTables = tables.filter((_, index) => index !== tableIndex);
    setTables(updatedTables);
  };

  const updateTableTitle = (tableIndex, newTitle) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].title = newTitle;
    setTables(updatedTables);
  };

  const updateColumnHeader = (tableIndex, columnIndex, newHeader) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].headers[columnIndex] = newHeader;
    setTables(updatedTables);
  };

  const removeColumn = (tableIndex, columnIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].headers.splice(columnIndex, 1);
    updatedTables[tableIndex].rows.forEach((row) => {
      delete row[Object.keys(row)[columnIndex]];
    });
    setTables(updatedTables);
  };

  const addColumn = (tableIndex) => {
    const newColumnName = `Column ${tables[tableIndex].headers.length + 1}`;
    const updatedTables = [...tables];
    updatedTables[tableIndex].headers.push(newColumnName);
    updatedTables[tableIndex].rows.forEach((row) => {
      row[newColumnName] = "";
    });
    setTables(updatedTables);
  };

  const updateCell = (tableIndex, rowIndex, columnKey, newValue) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].rows[rowIndex][columnKey] = newValue;
    setTables(updatedTables);
  };

  const removeRow = (tableIndex, rowIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].rows.splice(rowIndex, 1);
    setTables(updatedTables);
  };

  const addRow = (tableIndex) => {
    const newRow = {};
    tables[tableIndex].headers.forEach((header) => {
      newRow[header] = "";
    });
    const updatedTables = [...tables];
    updatedTables[tableIndex].rows.push(newRow);
    setTables(updatedTables);
  };

  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setStyles((prevStyles) => ({
          ...prevStyles,
          backgroundImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveData = async () => {
    const dataToSave = { tables, styles };
    try {
      const response = await fetch("/save-data", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });
      if (response.ok) {
        alert("Изменения успешно сохранены");
      } else {
        alert("Ошибка при сохранении изменений");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных на сервер:", error);
    }
  };

  const cancelChanges = () => {
    setTables(previousTables);
    setStyles(previousStyles);
    setShowPopup(false);
  };

  const toggleEditMode = () => {
    setPreviousTables([...tables]);
    setPreviousStyles({ ...styles });
    setShowPopup(!showPopup);
  };

  return (
    <div
      className="main-screen"
      style={{
        backgroundImage: `url(${styles.backgroundImage})`,
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: styles.overlayOpacity,
          zIndex: 0,
        }}
      ></div>
      <button className="editButton" onClick={toggleEditMode}>
        {showPopup ? "Закрыть редактирование" : "Режим редактирования"}
      </button>

      {showPopup && (
        <div id="popup" class="popup">
          <button onClick={addNewTable}>Добавить таблицу</button>
          <label>
            Изменять таблицы
            <input
              type="checkbox"
              checked={isEditing}
              onChange={(e) => setIsEditing(e.target.checked)}
            />
          </label>
          <label>
            Фоновое изображение:
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
            />
          </label>

          <label>
            Уровень затемнения:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={styles.overlayOpacity}
              onChange={(e) =>
                setStyles({ ...styles, overlayOpacity: e.target.value })
              }
            />
          </label>
          <h2>Редактирование стиля</h2>
          {/* Выбор шрифтов */}
          <label>
            Жирный текст
            <input
              type="checkbox"
              checked={styles.isBold}
              onChange={(e) =>
                setStyles({ ...styles, isBold: e.target.checked })
              }
            />
          </label>
          <label>
            Шрифт таблиц:
            <select
              value={styles.fontFamily}
              onChange={(e) =>
                setStyles({ ...styles, fontFamily: e.target.value })
              }
            >
              <option value="Arial" selected>
                Arial
              </option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
              <option value="Impact">Impact</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Lucida Console">Lucida Console</option>
            </select>
          </label>

          {/* Заголовок таблиц */}
          <label>
            Цвет заголовков таблиц:
            <input
              type="color"
              value={styles.fontColorHeader}
              onChange={(e) =>
                setStyles({ ...styles, fontColorHeader: e.target.value })
              }
            />
          </label>
          <label>
            Тень заголовков таблиц:
            <input
              type="color"
              id="shadowColorTitle"
              value={styles.shadowColorTitle}
              onChange={(e) =>
                setStyles({ ...styles, shadowColorTitle: e.target.value })
              }
            />
          </label>
          <label>
            Размер шрифта заголовков таблиц:
            <input
              type="range"
              min="10"
              max="72"
              value={styles.titleFontSize}
              onChange={(e) =>
                setStyles({ ...styles, titleFontSize: e.target.value })
              }
            />
            <span id="titleFontSizeValue">{styles.titleFontSize}px</span>
          </label>

          {/* Заголовок столбцов */}
          <label>
            Цвет заголовков столбцов:
            <input
              type="color"
              value={styles.fontColorColumn}
              onChange={(e) =>
                setStyles({ ...styles, fontColorColumn: e.target.value })
              }
            />
          </label>
          <label>
            Тень заголовков столбцов:
            <input
              type="color"
              value={styles.shadowColorHeader}
              onChange={(e) =>
                setStyles({ ...styles, shadowColorHeader: e.target.value })
              }
            />
          </label>
          <label>
            Размер шрифта заголовков:
            <input
              type="range"
              min="10"
              max="72"
              value={styles.headerFontSize}
              onChange={(e) =>
                setStyles({ ...styles, headerFontSize: e.target.value })
              }
            />
            <span id="headerFontSizeValue">{styles.headerFontSize}px</span>
          </label>

          {/* Содержимое таблиц */}
          <label>
            Цвет содержимого:
            <input
              type="color"
              value={styles.fontColorContent}
              onChange={(e) =>
                setStyles({ ...styles, fontColorContent: e.target.value })
              }
            />
          </label>
          <label>
            Размер шрифта содержимого:
            <input
              type="range"
              id="contentFontSizeSlider"
              min="10"
              max="36"
              value={styles.contentFontSize}
              onChange={(e) =>
                setStyles({ ...styles, contentFontSize: e.target.value })
              }
            />
            <span id="contentFontSizeValue">{styles.contentFontSize}px</span>
          </label>

          <label>
            Цвет фона:
            <input
              type="color"
              id="bgColor"
              value={styles.bgColor}
              onChange={(e) =>
                setStyles({ ...styles, bgColor: e.target.value })
              }
            />
          </label>

          <button onClick={saveData}>Сохранить</button>
          <button onClick={cancelChanges}>Отменить</button>
        </div>
      )}

      {tables.map((table, tableIndex) => (
        <Rnd
          key={tableIndex}
          size={{ width: table.size.width, height: table.size.height }}
          position={{ x: table.position.x, y: table.position.y }}
          onDragStop={(e, d) => {
            const updatedTables = [...tables];
            updatedTables[tableIndex].position = { x: d.x, y: d.y };
            setTables(updatedTables);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            const updatedTables = [...tables];
            updatedTables[tableIndex].size = {
              width: ref.style.width,
              height: ref.style.height,
            };
            setTables(updatedTables);
          }}
          bounds="parent"
          style={{
            border: "1px solid #000",
            backgroundColor: `${styles.bgColor}99`,
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <div>
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
              {isEditing ? (
                <input
                  type="text"
                  value={table.title}
                  onChange={(e) => updateTableTitle(tableIndex, e.target.value)}
                />
              ) : (
                table.title
              )}
            </h1>

            {isEditing ? (
              <button onClick={() => removeTable(tableIndex)}>
                Удалить таблицу
              </button>
            ) : null}

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
                      {isEditing ? (
                        <input
                          type="text"
                          value={header}
                          onChange={(e) =>
                            updateColumnHeader(
                              tableIndex,
                              columnIndex,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        header
                      )}
                      {isEditing && (
                        <button
                          onClick={() => removeColumn(tableIndex, columnIndex)}
                        >
                          Удалить столбец
                        </button>
                      )}
                    </th>
                  ))}
                  {isEditing && (
                    <th>
                      <button onClick={() => addColumn(tableIndex)}>
                        Добавить столбец
                      </button>
                    </th>
                  )}
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
                        {isEditing ? (
                          <input
                            type="text"
                            value={row[columnKey]}
                            onChange={(e) =>
                              updateCell(
                                tableIndex,
                                rowIndex,
                                columnKey,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          row[columnKey]
                        )}
                      </td>
                    ))}
                    {isEditing && (
                      <td>
                        <button onClick={() => removeRow(tableIndex, rowIndex)}>
                          Удалить строку
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {isEditing && (
                  <tr>
                    <td colSpan={table.headers.length + 1}>
                      <button onClick={() => addRow(tableIndex)}>
                        Добавить строку
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default AdminPage;
