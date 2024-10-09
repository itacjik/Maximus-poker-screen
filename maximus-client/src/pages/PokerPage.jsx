import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "../styles/styles.css";

const loadDataFromServer = async () => {
  const response = await fetch("/get-data");
  const data = await response.json();
  return data;
};

const PokerPage = () => {
  const [tables, setTables] = useState([]); 
  const [styles, setStyles] = useState({}); 

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
          opacity: styles.overlayOpacity || 0.5,
          zIndex: 0,
        }}
      ></div>
      {tables.map((table, tableIndex) => (
        <Rnd
          key={tableIndex}
          size={{ width: table.size.width, height: table.size.height }}
          position={{ x: table.position.x, y: table.position.y }}
          disableDragging={true}
          enableResizing={false} 
          bounds="parent"
          style={{
            border: "1px solid #000",
            backgroundColor: `${styles.bgColor || "#ffffff"}99`,
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
              {table.title}
            </h1>

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
