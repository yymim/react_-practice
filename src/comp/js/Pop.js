import React from "react";

import RegisterWordsPop from "./RegisterWordsPop.js";
import SearchDomainPop from "./SearchDomainPop.js";
import DomainRegistrationPop from "./DomainRegistrationPop.js";
import DomainUpdatePop from "./DomainUpdatePop.js";
import AlertPop from "./AlertPop.js";
import PingPop from "./PingPop.js";

import "../css/Common.css";
import "../css/Pop.css";

import help from "../../help.js";

import ConfirmPop from "./ConfirmPop.js";
import UpdateConfirmPop from "./UpdateConfirmPop.js";

function Pop({ pop, setPop, sendDataToParent }) {
  return (
    <div
      className="popDiv_outterDiv"
      style={{
        display: pop !== false ? "flex" : "none",
      }}
    >
      <div
        className="popDiv_outterDiv_innerDiv"
        style={{
          width: help.isNull(pop.width) ? "320px" : pop.width,
          height: help.isNull(pop.height) ? "160px" : pop.height,
          minWidth: help.nvl(pop.minWidth, "0px"),
          minHeight: help.nvl(pop.minHeight, "0px"),
          maxWidth: help.nvl(pop.maxWidth, pop.width),
          maxHeight: help.nvl(pop.maxHeight, pop.height),
        }}
      >
        {pop.div === "RegisterWordsPop" ? (
          <RegisterWordsPop pop={pop} setPop={setPop}></RegisterWordsPop>
        ) : pop.div === "SearchDomainPop" ? (
          <SearchDomainPop
            setPop={setPop}
            sendDataToParent={sendDataToParent}
          ></SearchDomainPop>
        ) : pop.div === "DomainRegistrationPop" ? (
          <DomainRegistrationPop
            pop={pop}
            setPop={setPop}
            sendDataToParent={sendDataToParent}
          ></DomainRegistrationPop>
        ) : pop.div === "DomainUpdatePop" ? (
          <DomainUpdatePop pop={pop} setPop={setPop}></DomainUpdatePop>
        ) : pop.div === "PingPop" ? (
          <PingPop pop={pop} setPop={setPop}></PingPop>
        ) : pop.div === "AlertPop" ? (
          <AlertPop
            pop={pop}
            setPop={setPop}
            sendDataToParent={sendDataToParent}
          ></AlertPop>
        ) : pop.div === "ConfirmPop" ? (
          <ConfirmPop
            pop={pop}
            setPop={setPop}
            sendDataToParent={sendDataToParent}
          ></ConfirmPop>
        ) : pop.div === "UpdateConfirmPop" ? (
          <UpdateConfirmPop
            pop={pop}
            setPop={setPop}
            sendDataToParent={sendDataToParent}
          ></UpdateConfirmPop>
        ) : null}
      </div>
    </div>
  );
}

export default Pop;
