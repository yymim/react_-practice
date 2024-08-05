import React, { useState, useRef, useEffect } from "react";

import axiosInstance from "./api/axiosInstance.js";

import AlertPop from "./comp/js/Pop.js";
import myGif from "../src/loading.gif";
import Pop from "./comp/js/Pop.js";
import help from "./help.js";

import TabDomainUpdata from "./comp/js/TabDomainUpdata.js";
import TabWordSearch from "./comp/js/TabWordSearch.js";
import TabSearch from "./comp/js/TabSearch.js";
import TabAdd from "./comp/js/TabAdd.js";

import logoImg from "./img/logo-256.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import "./comp/css/Common.css";
import "./App.css";

function App() {
  const [loadingBar, setLoadingBar] = useState(false);

  const [appData, setAppData] = useState();
  const [no, setNo] = useState(0);
  const [pop, setPop] = useState(false);

  const [alertPop, setAlertPop] = useState(false);
  const alertCallBack = useRef(null);

  const searchTimeout = useRef(null);
  const isTran = useRef(true);
  const searchValue = useRef("");
  const http = useRef("");

  useEffect(() => {
    if (alertCallBack.current === "NotFindURL") {
      let pop = { width: 380, height: 230, div: "PingPop" };
      setPop(pop);
    }
    alertCallBack.current = null;
  }, [alertPop]);

  useEffect(() => {
    const pingTest = function () {
      setLoadingBar(true);
      const url = "/api/v1/ping";
      const timeout = 3000;

      const fetchDataPromise = axiosInstance.get(url);
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("요청 시간 초과"));
        }, timeout);
      });

      Promise.race([fetchDataPromise, timeoutPromise])
        .then((response) => {
          if (response.data.status === 0) {
            setTimeout(() => {
              setLoadingBar(false);
            }, 500);
          }
        })
        .catch((error) => {
          setLoadingBar(false);
          let pop = {
            div: "AlertPop",
            data: "서버 URL를 찾을 수 없습니다.",
            callback: "NotFindURL",
          };
          setAlertPop(pop);
        });
    };

    if (window.electron) {
      window.electron.receive("update-downloaded", () => {
        let pop = {
          div: "UpdateConfirmPop",
        };
        setPop(pop);
      });
    }

    pingTest();
  }, []);

  const handleDataFromChild = (obj) => {
    if (obj.name === "AlertPop") {
      if (obj.callback === "NotFindURL") {
        alertCallBack.current = "NotFindURL";
      }
    }
  };

  const handleHttp = async (num = 999) => {
    let https = searchValue.current;

    let url = "";

    if (!isTran.current && help.isNull(https)) {
      setAppData();
      if (num !== 1) {
        setNo(num);
      }
      return;
    }

    switch (num) {
      case 0:
        url = "/api/v1/stddic/searchterm?dicLogNm=" + https;

        try {
          setLoadingBar(true);
          const response = await axiosInstance.get(url);

          if (response.data.length > 0) {
            setNo(0);
          } else {
            setNo(1);
          }

          setAppData(response.data);
        } catch (error) {
          if (error.code === "ERR_NETWORK") {
            console.error("서버 주소를 확인해주세요.");
          } else {
            console.error("조회 데이터를 받아올 수 없음.", error);
          }
        } finally {
          setLoadingBar(false);
        }
        break;
      case 2:
        url = "/api/v1/stddic/searchword?dicNm=" + https;

        try {
          setLoadingBar(true);
          const response = await axiosInstance.get(url);

          setAppData(response.data);
        } catch (error) {
          console.error("단어 조회 데이터를 받아올 수 없음.", error);
        } finally {
          setNo(2);
          setLoadingBar(false);
        }
        break;
      case 3:
        url = "/api/v1/stddom/searchdom?domNm=" + https;

        try {
          setLoadingBar(true);
          const response = await axiosInstance.get(url);

          setAppData(response.data);
        } catch (error) {
          console.error("도메인 데이터를 받아올 수 없음.", error);
        } finally {
          setNo(3);
          setLoadingBar(false);
        }
        break;
      default:
        url = "/api/v1/stddic/searchterm?dicLogNm=" + https;

        try {
          setLoadingBar(true);
          const response = await axiosInstance.get(url);

          if (response.data.length > 0) {
            setNo(0);
          } else {
            setNo(1);
          }

          setAppData(response.data);
        } catch (error) {
          console.error("조회 데이터를 받아올 수 없음.", error);
        } finally {
          setLoadingBar(false);
        }
        break;
    }
  };

  return (
    <div className="appDiv">
      <div className="appDiv_topDiv">
        <div className="appDiv_topDiv_mainDiv">
          <label
            className="appDiv_topDiv_mainDiv_label"
            style={{ userSelect: "none" }}
          >
            {/* 표준 속성 추가 */}
            <p className="img">
                <img 
                  src={logoImg}
                  className="logo-img"
                  alt="logo"
                />
            </p>
            <p className="text">
              DD
            </p>
          </label>
          <div
            className="appDiv_topDiv_sideText"
          >
            <button
              className="btn btn01"
              onClick={(e) => {
                let pop = { width: 380, height: 230, div: "PingPop" };
                setPop(pop);
              }}
            >
              URL 변경 <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
            </button>
            <label className="text" style={{ userSelect: "none" }}>
              {help.isNull(localStorage.getItem("DD_API_URL"))
                ? null
                : String(localStorage.getItem("DD_API_URL")).replace(/"/g, "")}
            </label>
          </div>
        </div>
        <div className="appDiv_topDiv_compDiv">
          <input
            type="text"
            placeholder="신규 등록 시 구분자는_"
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
                  isTran.current = true;
                  http.current = searchValue.current;

                  switch (no) {
                    case 2:
                      handleHttp(2);
                      break;
                    case 3:
                      handleHttp(3);
                      break;
                    default:
                      handleHttp();
                      break;
                  }
                }, 300);
              }
            }}
          ></input>
          <button
            className="btn btn02"
            onClick={() => {
              isTran.current = true;
              http.current = searchValue.current;

              switch (no) {
                case 2:
                  handleHttp(2);
                  break;
                case 3:
                  handleHttp(3);
                  break;
                default:
                  handleHttp();
                  break;
              }
            }}
          >
            &nbsp;<FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />&nbsp;
          </button>
        </div>
      </div>
      <div className="appDiv_bodyDiv">
        <div className="appDiv_bodyDiv_topDiv">
          <button
            className={
              no === 0
                ? "appDiv_bodyDiv_topDiv__tabButton click"
                : "appDiv_bodyDiv_topDiv__tabButton"
            }
            onClick={() => {
              isTran.current = false;
              http.current = help.nvl(searchValue.current, "");
              handleHttp(0);
            }}
          >
            <p className="title"><span className="icon"><FontAwesomeIcon icon="fa-solid fa-check-to-slot" /></span> 용어 조회</p>
          </button>
          <button
            className={
              no === 1
                ? "appDiv_bodyDiv_topDiv__tabButton click"
                : "appDiv_bodyDiv_topDiv__tabButton"
            }
            onClick={() => {
              isTran.current = false;
              setNo(1);
            }}
          >
            <p className="title"><span className="icon"><FontAwesomeIcon icon="fa-solid fa-file-pen" /></span> 용어 등록</p>
          </button>
          <button
            className={
              no === 2
                ? "appDiv_bodyDiv_topDiv__tabButton click"
                : "appDiv_bodyDiv_topDiv__tabButton"
            }
            onClick={() => {
              isTran.current = false;
              handleHttp(2);
            }}
          >
            <p className="title"><span className="icon"><FontAwesomeIcon icon="fa-solid fa-clipboard-list" /></span> 단어 관리</p>
          </button>
          <button
            className={
              no === 3
                ? "appDiv_bodyDiv_topDiv__tabButton click"
                : "appDiv_bodyDiv_topDiv__tabButton"
            }
            style={{ display: "none" }}
            onClick={() => {
              isTran.current = false;
              handleHttp(3);
            }}
          >
            도메인 수정탭
          </button>
        </div>
        <div className="appDiv_bodyDiv_mainDiv">
          {!help.isNull(isTran.current) ? (
            no === 0 ? (
              <TabSearch data={appData} handleHttp={handleHttp}></TabSearch>
            ) : no === 1 ? (
              <TabAdd
                http={searchValue.current}
                handleHttp={handleHttp}
              ></TabAdd>
            ) : no === 2 ? (
              <TabWordSearch
                data={appData}
                handleHttp={handleHttp}
              ></TabWordSearch>
            ) : (
              <TabDomainUpdata
                data={appData}
                handleHttp={handleHttp}
              ></TabDomainUpdata>
            )
          ) : no === 0 ? (
            <TabSearch></TabSearch>
          ) : no === 1 ? (
            <TabAdd></TabAdd>
          ) : no === 2 ? (
            <TabWordSearch></TabWordSearch>
          ) : (
            <TabDomainUpdata></TabDomainUpdata>
          )}
        </div>
      </div>
      <footer>
        <div className="footerDiv">
          <label className="fLabel">
            &nbsp;&nbsp;&nbsp;@
            <label
              style={{
                color: "#888",
                textDecoration: "none",
              }}
            >
              표준속성
            </label>
          </label>
        </div>
      </footer>
      {loadingBar ? (
        <div className="loadingBar">
          <img src={myGif} alt=""></img>
        </div>
      ) : null}
      {pop ? (
        <Pop
          pop={pop}
          setPop={setPop}
          sendDataToParent={handleDataFromChild}
        ></Pop>
      ) : null}
      {alertPop ? (
        <AlertPop
          pop={alertPop}
          setPop={setAlertPop}
          sendDataToParent={handleDataFromChild}
        ></AlertPop>
      ) : null}
    </div>
  );
}

export default App;
