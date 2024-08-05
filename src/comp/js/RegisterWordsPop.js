import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import AlertPop from "./Pop.js";
import myGif from "../../loading.gif";
import help from "../../help.js";

import "../css/Common.css";
import "../css/Pop.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function RegisterWordsPop({ pop, setPop }) {
  const [loadingBar, setLoadingBar] = useState(false);
  const [data, setData] = useState(pop.data);

  const [alertPop, setAlertPop] = useState(false);
  const alertCallBack = useRef(null);

  const handleDataFromChild = (obj) => {
    if (obj.name === "ConfirmPop") {
      if (obj.callback === "Updata") {
        alertCallBack.current = "Updata";
      }
    }
  };

  useEffect(() => {
    if (alertCallBack.current === "Updata") {
      handleSubmit2();
    }

    alertCallBack.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertPop]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let pop = {
      div: "ConfirmPop",
      data: "단어를 등록하시겠습니까?",
      callback: "Updata",
    };
    setAlertPop(pop);

    if (!data.str) {
      let pop = {
        div: "AlertPop",
        data: "논리명을 입력해주세요.",
      };
      setAlertPop(pop);
      return;
    }

    if (!data.dic_phy_nm) {
      let pop = {
        div: "AlertPop",
        data: "물리명을 입력해주세요.",
      };
      setAlertPop(pop);
      return;
    }
  };

  const handleSubmit2 = async () => {
    let postData = {
      dic_log_nm: data.str,
      dic_phy_nm: data.dic_phy_nm,
      dic_desc: data.dic_desc,
    };

    let formData = JSON.stringify(postData);

    try {
      setLoadingBar(true);
      const response = await axiosInstance.post(
        "/api/v1/stddic/insertword",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!help.isNull(response.data?.status) && response.data?.status === -1) {
        let pop = {
          div: "AlertPop",
          data: response.data.message,
        };
        setAlertPop(pop);
      } else {
        setPop(false);
      }
    } catch (error) {
      let pop = {
        div: "AlertPop",
        data: "단어 등록 에러",
      };
      setAlertPop(pop);
      console.error("단어 등록 에러:", error);
    } finally {
      setLoadingBar(false);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div className="popHead">
        <label className="title">단어 등록</label>
        <label
          className="btn__close"
          onClick={(e) => {
            setPop(false);
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
        </label>
      </div>
      <div className="popDiv">
        <div className="top__wrap">
          <label className="mainLabel">단어 데이터</label>
        </div>
        <div className="main__wrap">
          <table className="grid-container__table">
            <thead></thead>
            <tbody>
              <tr>
                <th className="essentialLabel"><p>논리명</p></th>
                <td>{data.str}</td>
              </tr>
              <tr>
                <th className="essentialLabel"><p>물리명</p></th>
                <td>
                  <input
                    type="text"
                    placeholder="영어 대문자만 입력 가능합니다."
                    value={
                      !help.isNull(data.dic_phy_nm) ? data.dic_phy_nm || "" : ""
                    }
                    onChange={(e) => {
                      let newValue = e.target.value;

                      newValue = String(
                        newValue.replace(/[^A-Za-z]/g, "")
                      ).toUpperCase();

                      setData((prevData) => ({
                        ...prevData,
                        dic_phy_nm: newValue,
                      }));
                    }}
                  ></input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="top__wrap"
          style={{ paddingTop: "10px" }}>
          <label className="mainLabel">용어 기타</label>
        </div>
        <div className="main__wrap">
          <table className="grid-container__table">
            <thead></thead>
            <tbody>
              <tr>
                <th>엔터티 분류어</th>
                <td>True</td>
              </tr>
              <tr>
                <th>속성 분류어</th>
                <td>True</td>
              </tr>
              <tr>
                <th rowSpan={2}>설명</th>
                <td rowSpan={2}>
                  <textarea
                    value={!help.isNull(data) ? data.dic_desc || "" : ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setData((prevData) => ({
                        ...prevData,
                        dic_desc: newValue,
                      }));
                    }}
                  ></textarea>
                </td>
              </tr>
              <tr></tr>
            </tbody>
          </table>
        </div>
        <div className="button__wrap"
          style={{paddingTop: "25px"}}
        >
          <button
            className="btn btn02"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            등록
          </button>
          <button
            className="btn btn_cancel"
            onClick={(e) => {
              setPop(false);
            }}
          >
            닫기
          </button>
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
    </div>
  );
}

export default RegisterWordsPop;
