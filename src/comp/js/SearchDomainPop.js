import React, { useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import AlertPop from "./Pop.js";
import myGif from "../../loading.gif";
import help from "../../help.js";
import Gridcomp from "./Gridcomp.js";
import "../css/Pop.css";

import Pop from "./Pop.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SearchDomainPop({ setPop, sendDataToParent }) {
  const [loadingBar, setLoadingBar] = useState(false);
  const [domaindata, setDomainData] = useState({});
  const [alertPop, setAlertPop] = useState(false);
  const [pop2, setPop2] = useState(false);

  const http = useRef("");
  const searchValue = useRef("");
  const rowPosition = useRef(null);
  const searchTimeout = useRef(null);

  const onDoubleClick = function (domaindata, rowPosition) {
    if (!help.isNull(rowPosition)) {
      sendDataToParent({
        name: "SearchDomainPop",
        domdata: domaindata.origindata[rowPosition],
      });
    }

    setPop(false);
  };

  const grid = useRef({
    id: "SearchDomainPop",
    colInfo: [
      { name: "대표도메인명", col: "key_dom_nm", size: 170 },
      { name: "도메인명", col: "dom_nm", size: 150 },
      { name: "그룹", col: "dom_grp_nm", size: 60 },
      { name: "유형", col: "dom_type_nm", size: 60 },
      { name: "타입", col: "data_type_nm", size: 90 },
      { name: "길이", col: "data_len", size: 75 },
      { name: "소수점", col: "data_scale", size: 85 },
    ],
    sort: true,
    onDoubleClick: onDoubleClick,
  });

  const handleHttp = async () => {
    let https = http.current;

    let url = "/api/v1/stddom/searchdom?domNm=" + https;
    try {
      setLoadingBar(true);

      const response = await axiosInstance.get(url);

      if (response.data.length === 0) {
        let pop = {
          div: "AlertPop",
          data: "데이터가 없습니다.",
        };
        setAlertPop(pop);
        return;
      }

      const arrayData = response.data;
      const axiosData = {
        id: "TabAdd",
        data: arrayData,
        colInfo: grid.current.colInfo,
      };

      const objData = help.axiosData(axiosData);

      const dataObj = {
        data: objData.data,
        origindata: response.data,
      };

      setDomainData(dataObj);
    } catch (error) {
      let pop = {
        div: "AlertPop",
        data: "용어 등록 에러",
      };
      setAlertPop(pop);
      console.error("용어 등록 에러:", error);
    } finally {
      setLoadingBar(false);
    }
  };

  const handleDataFromChild = (obj) => {
    if (obj.name === "Gridcomp") {
      if (!help.isNull(obj.rowposition)) {
        rowPosition.current = obj.rowposition;
      }
    } else if (obj.name === "DomainRegistrationPop") {
      http.current = obj.data;
      handleHttp();
    }
  };

  return (
    <div className="SearchDomainPop" style={{ height: "100%" }}>
      <div className="popHead">
        <div className="title">다른 도메인 찾기</div>
        <div
          className="btn__close"
          onClick={(e) => {
            setPop(false);
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
        </div>
      </div>
      <div className="popDiv">
        <div className="top__wrap">
          <label className="mainLabel">
            표준 분류
            <p className="mainLabel_side__text">
              {!help.isNull(domaindata) ? domaindata.data?.length + '건' : null}
            </p>
          </label>
          <div className="top_search__line">
            <input
              type="text"
              onChange={(e) => {
                searchValue.current = e.target.value;
              }}
              onKeyDown={(e) => {
                if (e.code === "Enter" || e.code === "NumpadEnter") {
                  e.preventDefault();
                  if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current);
                  }
                  searchTimeout.current = setTimeout(() => {
                    http.current = searchValue.current;
                    handleHttp();
                  }, 300);
                }
              }}
            ></input>
            <button
              className="btn btn02"
              onClick={() => {
                http.current = searchValue.current;
                handleHttp();
              }}
            >
              &nbsp;<FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />&nbsp;
            </button>
          </div>
        </div>
        <div
          className="main__wrap"
          style={{  height: "calc(100% - 140px)" }}
        >
          {!help.isNull(domaindata) ? (
            <Gridcomp
              initialData={domaindata}
              format={grid.current}
              sendDataToParent={handleDataFromChild}
            ></Gridcomp>
          ) : (
            <Gridcomp format={grid.current}></Gridcomp>
          )}
        </div>
        <div className="button__wrap">
          <div className="popDiv_buttonDiv_leftButtonDiv">
            <button
              className="btn"
              onClick={(e) => {
                let pop2 = {
                  width: 400,
                  height: 690,
                  div: "DomainRegistrationPop",
                };

                setPop2(pop2);
              }}
            >
              등록
            </button>
            {!help.isNull(domaindata) ? (
              <button
                className="btn"
                onClick={(e) => {
                  let pop2 = {
                    id: "TabDomainUpdata",
                    width: 400,
                    height: 690,
                    data: domaindata.origindata[rowPosition.current],
                    div: "DomainRegistrationPop",
                  };

                  setPop2(pop2);
                }}
              >
                수정
              </button>
            ) : null}
          </div>
          <div className="popDiv_buttonDiv_rightButtonDiv">
            <button
              className="btn btn01"
              onClick={(e) => {
                if (!help.isNull(rowPosition.current)) {
                  sendDataToParent({
                    name: "SearchDomainPop",
                    domdata: domaindata.origindata[rowPosition.current],
                  });
                }

                setPop(false);
              }}
            >
              확인
            </button>
            {/* <button
              onClick={(e) => {
                setPop(false);
              }}
            >
              닫기
            </button> */}
          </div>
        </div>
        {pop2 ? (
          <Pop
            pop={pop2}
            setPop={setPop2}
            sendDataToParent={handleDataFromChild}
          ></Pop>
        ) : null}
        {loadingBar ? (
          <div className="loadingBar">
            <img src={myGif} alt=""></img>
          </div>
        ) : null}
        {alertPop ? (
          <AlertPop
            pop={alertPop}
            setPop={setAlertPop}
            sendDataToParent={handleDataFromChild}
          ></AlertPop>
        ) : null}
      </div>
    </div>
  );
}

export default SearchDomainPop;
