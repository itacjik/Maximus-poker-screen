import React from "react";
import "./PokerPage.css";

const pokerData = [
  { limits: "1$/2$", rake: "Mark", cap: "Otto", minBuyIn: "@mdo" },
  { limits: "2$/2$", rake: "Jacob", cap: "Thornton", minBuyIn: "@fat" },
  { limits: "2$/2$", rake: "Jacob", cap: "Thornton", minBuyIn: "@fat" },
  { limits: "2$/2$", rake: "Jacob", cap: "Thornton", minBuyIn: "@fat" },
];

const PokerScreen = () => {
  return (
    <div className="poker-screen">
      <div className="container">
        <div className="row">
          {/* TEXAS & OMAHA Section */}
          <div className="col-6">
            <h1>TEXAS & OMAHA</h1>
            <table className="table">
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
                    <td>{row.limits}</td>
                    <td>{row.rake}</td>
                    <td>{row.cap}</td>
                    <td>{row.minBuyIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CHINESE POKER Section */}
          <div className="col-6">
            <h1>CHINESE POKER</h1>
            {/* Можно добавить содержание позже */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerScreen;
