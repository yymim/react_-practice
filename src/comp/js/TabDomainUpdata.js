import React, { useState, useEffect, useRef } from "react";
import help from "../../help.js";

import "../css/Common.css";
import "../css/Tab.css";

import Gridcomp from "./Gridcomp.js";
import Pop from "./Pop.js";

function TabDomainUpdata({ data, handleHttp }) {
  const [domainData, setDomainData] = useState("");
  const [pop, setPop] = useState(false);

  const grid = useRef({
    id: "TabDomainUpdata",
    colInfo: [
      { name: "대표도메인명", col: "key_dom_nm", size: 150 },
      { name: "도메인명", col: "dom_nm", size: 150 },
      { name: "그룹", col: "dom_grp_nm", size: 80 },
      { name: "유형", col: "dom_type_nm", size: 80 },
      { name: "타입", col: "data_type_nm", size: 100 },
      { name: "길이", col: "data_len", size: 75 },
      { name: "소수점", col: "data_scale", size: 75 },
      { name: "수정", col: "nodata0", type: "button", size: 80 },
    ],
    sort: true,
  });

  useEffect(() => {
    if (data) {
      const axiosData = {
        id: "TabDomainUpdata",
        data: data,
        colInfo: grid.current.colInfo,
      };

      const objData = help.axiosData(axiosData);

      const dataObj = {
        id: "TabDomainUpdata",
        data: objData.data,
        origindata: data,
      };

      setDomainData(dataObj);
    }
  }, [data]);

  const handleDataFromChild = (obj) => {
    if (obj.name === "Gridcomp_button") {
      if (obj.pop) {
        let pop = {
          id: "TabDomainUpdata",
          width: "400px",
          height: "690px",
          data: domainData.origindata[obj.rowposition],
          div: "DomainRegistrationPop",
        };

        setPop(pop);
      }
    } else if (obj.name === "DomainRegistrationPop") {
      handleHttp(3);
    }
  };

  return (
    <div className="TabSearchDiv">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <label className="mainLabel">
          도메인 목록
          {!help.isNull(domainData)
            ? Number(domainData.data?.length) !== 0
              ? " : " + Number(domainData.data?.length)
              : null
            : null}
        </label>
      </div>
      <div className="gridInnerDiv">
        {!help.isNull(domainData) ? (
          <Gridcomp
            initialData={domainData}
            format={grid.current}
            sendDataToParent={handleDataFromChild}
          ></Gridcomp>
        ) : (
          <Gridcomp format={grid.current}></Gridcomp>
        )}
      </div>
      {pop ? (
        <Pop
          pop={pop}
          setPop={setPop}
          sendDataToParent={handleDataFromChild}
        ></Pop>
      ) : null}
    </div>
  );
}

export default TabDomainUpdata;
