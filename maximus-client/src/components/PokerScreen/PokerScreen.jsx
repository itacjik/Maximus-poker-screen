import React from "react";
import "./PokerScreen.css";

const PokerScreen = () => {
  return (
    <div className="poker-screen">
      <div className="container ">
        <div className="row">
          <div className="col-6">
            <h1> TEXAS & OMAHA </h1>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Limits</th>
                  <th scope="col">Rake</th>
                  <th scope="col">Cap</th>
                  <th scope="col">Min Buy In</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1$/2$</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Larry</td>
                  <td>the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-6">
            <h1> CHINESE POKER </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerScreen;
