import React from "react";

import help from "../../help.js";

import "../css/Common.css";
import "../css/SideBar.css";

function SideBar({ sideBar, setSideBar, sendDataToParent }) {
  return (
    <div
      style={{
        top: "0px",
        bottom: "0px",
        left: "-10px",
        width: "100%",
        position: "fixed",
        zIndex: "5",
      }}
    >
      <div
        className="SideBarDiv"
        style={{
          top: "0px",
          bottom: "0px",
          width: "18%",
          minWidth: "350px",
          position: "fixed",
          zIndex: "5",
        }}
      >
        <div className="sideHamburgerDiv">
          <div
            className="Img_Hamburger"
            onClick={(e) => {
              let bol = !sideBar;
              setSideBar(bol);
            }}
            style={{
              margin: "0px 7px 0px 0px",
              width: "27px",
              height: "27px",
              cursor: "pointer",
            }}
          ></div>
        </div>
        <div className="sidemenu sidemenuLast">
          {" "}
          <button
            onClick={(e) => {
              let pop = { width: 380, height: 230, div: "PingPop" };
            }}
          >
            URL 변경
          </button>
          <label className="p12 pd5" style={{ userSelect: "none" }}>
            {help.isNull(localStorage.getItem("DD_API_URL"))
              ? null
              : String(localStorage.getItem("DD_API_URL")).replace(/"/g, "")}
          </label>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
