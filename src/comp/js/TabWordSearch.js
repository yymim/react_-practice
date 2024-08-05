import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import myGif from "../../loading.gif";
import help from "../../help.js";

import "../css/Common.css";
import "../css/Tab.css";

import Gridcomp from "./Gridcomp.js";
import AlertPop from "./Pop.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function TabWordSearch({ data, handleHttp }) {
  const [wordSearchData, setWordSearchData] = useState("");
  const [loadingBar, setLoadingBar] = useState(false);
  const [alertPop, setAlertPop] = useState(false);

  const rowPosition = useRef(null);
  const alertCallBack = useRef(null);

  const grid = useRef({
    id: "TabWordSearch",
    colInfo: [
      { name: "단어 논리명", col: "dic_log_nm", size: 420 },
      { name: "단어 물리명", col: "dic_phy_nm", size: 430 },
    ],
    sort: true,
  });

  useEffect(() => {
    if (data) {
      const axiosData = {
        id: "TabWordSearch",
        data: data,
        colInfo: grid.current.colInfo,
      };

      const objData = help.axiosData(axiosData);

      const dataObj = {
        id: "TabWordSearch",
        data: objData.data,
        origindata: data,
      };

      setWordSearchData(dataObj);
    }
  }, [data]);

  useEffect(() => {
    if (alertCallBack.current === "handleHttp") {
      handleHttp(2);
    } else if (alertCallBack.current === "Remove") {
      handleDeleteSubmit2();
    }

    alertCallBack.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertPop]);

  const handleDataFromChild = (obj) => {
    if (obj.name === "Gridcomp") {
      if (!help.isNull(obj.rowposition)) {
        rowPosition.current = obj.rowposition;
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
  };

  const handleDeleteSubmit = function (e) {
    if (help.isNull(wordSearchData) || wordSearchData.origindata.length === 0) {
      return;
    }

    let pop = {
      div: "ConfirmPop",
      data:
      <div><span>{wordSearchData.origindata[rowPosition.current].dic_log_nm}</span>을(를) 삭제하시겠습니까?"</div>,
      callback: "Remove",
    };
    setAlertPop(pop);
  };

  const handleDeleteSubmit2 = async () => {
    let dataObj;
    if (!help.isNull(rowPosition.current)) {
      dataObj = {
        dic_log_nm: wordSearchData.origindata[rowPosition.current].dic_log_nm,
        std_area_id:
          wordSearchData.origindata[rowPosition.current]?.std_area_id,
        dic_id: wordSearchData.origindata[rowPosition.current]?.dic_id,
        aval_end_dt:
          wordSearchData.origindata[rowPosition.current]?.aval_end_dt,
        aval_st_dt: wordSearchData.origindata[rowPosition.current]?.aval_st_dt,
      };
    } else {
      return;
    }

    let formData = JSON.stringify(dataObj);

    try {
      setLoadingBar(true);
      const response = await axiosInstance.delete("/api/v1/stddic/deleteword", {
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
          <div><span>{wordSearchData.origindata[rowPosition.current].dic_log_nm}</span>(이)가 삭제되었습니다.</div>,
          callback: "handleHttp",
        };
        setAlertPop(pop);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("단어 삭제 서버 오류:", error.response.data);
      } else if (error.request) {
        console.error("단어 삭제 응답 없음:", error.request);
      } else {
        console.error("단어 삭제 요청 오류:", error.message);
      }
      let pop = {
        div: "AlertPop",
        data: "단어 삭제 에러",
      };
      setAlertPop(pop);
    } finally {
      setLoadingBar(false);
    }
  };

  return (
    <div className="TabSearchDiv tab03">
      <div
        className="TabSearchDiv__wrap"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <label className="mainLabel">
            단어 목록
            <p className="mainLabel_side__text">
              {!help.isNull(wordSearchData)
                ? Number(wordSearchData.data?.length) !== 0
                  ? Number(wordSearchData.data?.length) + " 건"
                  : null
                : null}
            </p>
        </label>
        {!help.isNull(wordSearchData) ? (
          Number(wordSearchData.data?.length) !== 0 ? (
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
        {!help.isNull(wordSearchData) ? (
          <Gridcomp
            initialData={wordSearchData}
            format={grid.current}
            sendDataToParent={handleDataFromChild}
          ></Gridcomp>
        ) : (
          <Gridcomp format={grid.current}></Gridcomp>
        )}
      </div>
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

export default TabWordSearch;
