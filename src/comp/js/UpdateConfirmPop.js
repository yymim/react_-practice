import React from "react";
import "../css/Pop.css";

const UpdateConfirmPop = ({ pop, setPop, sendDataToParent }) => {
  return (
    <div style={{ height: "100%" }}>
      <div className="popDiv alert">
        <div className="text__wrap">
          <div className="confirm__text">
            <p>
              새로운 업데이트가 있습니다. <br /> 적용하시겠습니까?
            </p>
          </div>
          <div className="button__wrap">
            <button
              className="btn btn02"
              onClick={() => window.electron.send("apply-update")}
            >
              예
            </button>
            <button
              className="btn btn_cancel"
              onClick={(e) => {
                setPop(false);
              }}
            >
              아니오
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateConfirmPop;
