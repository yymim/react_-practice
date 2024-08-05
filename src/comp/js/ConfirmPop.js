import React from "react";

import help from "../../help.js";

import "../css/Common.css";
import "../css/Pop.css";

function ConfirmPop({ pop, setPop, sendDataToParent }) {
  return (
    <div style={{ height: "100%" }}>
      <div
        className="popDiv alert"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setPop(false);
          }
        }}
      >
        <div className="text__wrap">
          <label className="confirm__text">{pop.data}</label>
        </div>
        <div className="button__wrap">
          <button
            className="btn btn01"
            onClick={(e) => {
              if (!help.isNull(pop?.callback)) {
                sendDataToParent({
                  name: "ConfirmPop",
                  callback: pop.callback,
                });
              }

              setPop(false);
            }}
          >
            확인
          </button>
          <button
            className="btn btn_cancel"
            onClick={(e) => {
              setPop(false);
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPop;
