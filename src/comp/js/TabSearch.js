import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import myGif from "../../loading.gif";
import help from "../../help.js";

import "../css/Common.css";
import "../css/Tab.css";

import Gridcomp from "./Gridcomp.js";
import Pop from "./Pop.js";

import AlertPop from "./Pop.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function TabSearch({ data, handleHttp }) {
  const [loadingBar, setLoadingBar] = useState(false);

  const [searchData, setSearchData] = useState("");

  const rowPosition = useRef(null);

  const [alertPop, setAlertPop] = useState(false);
  const [pop, setPop] = useState(false);
  const alertCallBack = useRef(null);

  const grid = useRef({
    id: "TabSearch",
    colInfo: [
      { name: "용어 논리명", col: "dic_log_nm", size: 200 },
      { name: "용어 물리명", col: "dic_phy_nm", size: 250 },
      { name: "타입", col: "data_type_nm", size: 100 },
      { name: "도메인", col: "dom_nm", size: 100 },
      { name: "길이", col: "data_len", size: 60 },
      { name: "소수점", col: "data_scale", size: 50 },
      { name: "도메인 수정", col: "nodata0", type: "button", size: 85 },
    ],
    sort: true,
  });

  useEffect(() => {
    if (alertCallBack.current === "handleHttp") {
      handleHttp();
    } else if (alertCallBack.current === "Remove") {
      handleDeleteSubmit2();
    }

    alertCallBack.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertPop]);

  useEffect(() => {
    if (data) {
      const axiosData = {
        id: "TabSearch",
        data: data,
        colInfo: grid.current.colInfo,
      };

      const objData = help.axiosData(axiosData);

      const dataObj = {
        id: "TabSearch",
        data: objData.data,
        origindata: data,
      };

      setSearchData(dataObj);
    }
  }, [data]);

  const handleDataFromChild = (obj) => {
    if (obj.name === "Gridcomp") {
      if (!help.isNull(obj.rowposition)) {
        rowPosition.current = obj.rowposition;
      }
    } else {
      if (obj.name === "Gridcomp_button") {
        if (obj.pop) {
          let pop = {
            width: 550,
            height: 330,
            handleHttp: handleHttp,
            data: searchData.origindata[obj.rowposition],
            div: "DomainUpdatePop",
          };

          setPop(pop);
        }
      } else if (obj.name === "AlertPop") {
        if (obj.callback === "handleHttp") {
          alertCallBack.current = "handleHttp";
        }
      } else if (obj.name === "ConfirmPop") {
        if (obj.callback === "Remove") {
          alertCallBack.current = "Remove";
        }
      }
    }
  };

  const handleDeleteSubmit2 = async () => {
    let dataObj;

    if (!help.isNull(rowPosition.current)) {
      dataObj = {
        std_area_id: searchData.origindata[rowPosition.current]?.std_area_id,
        dic_id: searchData.origindata[rowPosition.current]?.dic_id,
        aval_end_dt: searchData.origindata[rowPosition.current]?.aval_end_dt,
        aval_st_dt: searchData.origindata[rowPosition.current]?.aval_st_dt,
      };
    } else {
      return;
    }

    let formData = JSON.stringify(dataObj);

    try {
      setLoadingBar(true);
      const response = await axiosInstance.delete("/api/v1/stddic/deleteterm", {
        data: formData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!help.isNull(response.data?.status) && response.data?.status === -1) {
        let pop = {
          div: "AlertPop",
          data: response.data.message,
        };
        setAlertPop(pop);
      } else {
        let pop = {
          div: "AlertPop",
          data:
          <div><span>{searchData.origindata[rowPosition.current].dic_log_nm}</span>"가 삭제되었습니다.</div>,
          callback: "handleHttp",
        };
        setAlertPop(pop);
      }
    } catch (error) {
      if (error.response) {
        console.error("용어 삭제 서버 오류:", error.response.data);
      } else if (error.request) {
        console.error("용어 삭제 응답 없음:", error.request);
      } else {
        console.error("용어 삭제 요청 오류:", error.message);
      }
      let pop = {
        div: "AlertPop",
        data: "용어 삭제 에러",
      };
      setAlertPop(pop);
    } finally {
      setLoadingBar(false);
    }
  };

  const handleDeleteSubmit = function (e) {
    if (help.isNull(searchData) || searchData.origindata.length === 0) {
      return;
    }

    let pop = {
      div: "ConfirmPop",
      data:
        <div><span>{searchData.origindata[rowPosition.current].dic_log_nm}</span>을(를) 삭제하시겠습니까?</div>,
      callback: "Remove",
    };
    setAlertPop(pop);
  };

  return (
    <div className="TabSearchDiv tab01">
      <div
        className="TabSearchDiv__wrap"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <label className="mainLabel">
          용어 목록
          <p className="mainLabel_side__text">
            {!help.isNull(searchData)
              ? Number(searchData.data?.length) !== 0
                ? Number(searchData.data?.length) + " 건" 
                : null
              : null}
          </p>
        </label>
        {!help.isNull(searchData) ? (
          Number(searchData.data?.length) !== 0 ? (
            <button
              className="btn mainLabel_btn"
              style={{
                width: "80px",
                height: "27px",
                margin: "0px 0px 0px 15px",
              }}
              onClick={(e) => {
                handleDeleteSubmit();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <FontAwesomeIcon icon="fa-solid fa-trash-can" />&nbsp;&nbsp;삭제
            </button>
          ) : null
        ) : null}
      </div>
      <div className="gridInnerDiv">
        {!help.isNull(searchData) ? (
          <Gridcomp
            initialData={searchData}
            format={grid.current}
            sendDataToParent={handleDataFromChild}
          ></Gridcomp>
        ) : (
          <Gridcomp format={grid.current}></Gridcomp>
        )}
      </div>
      {pop ? <Pop pop={pop} setPop={setPop}></Pop> : null}
      {alertPop ? (
        <AlertPop
          pop={alertPop}
          setPop={setAlertPop}
          sendDataToParent={handleDataFromChild}
        ></AlertPop>
      ) : null}
      {loadingBar ? (
        <div className="loadingBar">
          <img src={myGif} alt=""></img>
        </div>
      ) : null}
    </div>
  );
}

export default TabSearch;
