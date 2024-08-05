import React from "react";

import help from "../../help.js";

import "../css/Common.css";
import "../css/Pop.css";
 
function AlertPop({ pop, setPop, sendDataToParent }) {
  return (
    <div
      style={{ height: "100%" }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setPop(false);
        }
      }}
    >
      <div className="popDiv alert">
        <div className="text__wrap">
          <label className="confirm__text">{pop.data}</label>
        </div>
        <div className="button__wrap">
          <button
            className="btn btn_cancel"
            autoFocus
            onClick={(e) => {
              if (!help.isNull(pop?.callback)) {
                sendDataToParent({
                  name: "AlertPop",
                  callback: pop.callback,
                });
              }

              setPop(false);
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertPop;
