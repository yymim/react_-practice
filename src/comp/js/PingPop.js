import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance.js";
import myGif from "../../loading.gif";

import AlertPop from "./Pop.js";

import "../css/Common.css";
import "../css/Pop.css";

import help from "../../help.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function PingPop({ pop, setPop }) {
  const [loadingBar, setLoadingBar] = useState(false);

  const [alertPop, setAlertPop] = useState(false);
  const alertCallBack = useRef(null);

  const searchTimeout = useRef(null);
  const searchValue = useRef(
    help.isNull(localStorage.getItem("DD_API_URL"))
      ? "http://10.1.8.126:8080"
      : String(localStorage.getItem("DD_API_URL")).replace(/"/g, "")
  );

  const domain = useRef("");

  const handleDataFromChild = (obj) => {
    if (obj.name === "AlertPop") {
      if (obj.callback === "ServerLive") {
        alertCallBack.current = "ServerLive";
      }
    }
  };

  useEffect(() => {
    if (alertCallBack.current === "ServerLive") {
      axiosInstance.defaults.baseURL = String(
        localStorage.getItem("DD_API_URL")
      ).replace(/"/g, "");

      let pop = false;
      setPop(pop);
      // window.location.reload();
    }

    alertCallBack.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertPop]);

  const pingTest = async (e) => {
    e.preventDefault();
    domain.current = searchValue.current;

    if (help.isNull(domain.current)) {
      let pop = {
        div: "AlertPop",
        data: "주소 : 포트를 입력해주세요.",
      };
      setAlertPop(pop);
      return false;
    }

    if (String(searchValue.current).indexOf("http") === -1) {
      domain.current = "http://" + domain.current;
    }

    if (String(domain.current).split(":").length - 1 < 2) {
      domain.current = domain.current + ":8080";
    }

    setLoadingBar(true);

    const testAxios = axios.create({
      baseURL: domain.current,
    });

    const url = "/api/v1/ping";
    const timeout = 3000;

    const fetchDataPromise = testAxios.get(url);
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
            localStorage.setItem("DD_API_URL", JSON.stringify(domain.current));

            let pop = {
              div: "AlertPop",
              data: "서버와 연결되었습니다.",
              callback: "ServerLive",
            };
            setAlertPop(pop);
          }, 500);
        }
      })
      .catch((error) => {
        setLoadingBar(false);
        localStorage.removeItem("DD_API_URL");
        let pop = {
          div: "AlertPop",
          data: "서버 URL를 찾을 수 없습니다.",
        };
        setAlertPop(pop);
      });
  };

  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: "100%" }} className="popDiv pingPopDiv">
        <div className="top__wrap">
          <label className="title">API 서버 URL</label>
        </div>
        <div className="main__wrap">
          <input
            type="url"
            placeholder="ex) 10.1.8.126"
            defaultValue={help.nvl(searchValue.current, "http://10.1.8.126:8080")}
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
                  pingTest(e);
                }, 300);
              }
            }}
          ></input>
        </div>
        <div className="button__wrap">
          <button
            className="btn btn02"
            onClick={(e) => {
              pingTest(e);
            }}
          >
            연결
          </button>
        </div>
      </div>
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
  );
}

export default PingPop;
