import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import AlertPop from "./Pop.js";
import myGif from "../../loading.gif";
import help from "../../help.js";

import "../css/Common.css";
import "../css/Pop.css";

import Pop from "./Pop.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function DomainUpdatePop({ pop, setPop }) {
  const [loadingBar, setLoadingBar] = useState(false);
  const [addData, setAddData] = useState(pop.data);
  const [pop2, setPop2] = useState(false);

  const [alertPop, setAlertPop] = useState(false);
  const alertCallBack = useRef(null);

  const handleDataFromChild = (obj) => {
    if (obj.name === "SearchDomainPop") {
      if (!help.isNull(obj.domdata)) {
        const dataOdj = { ...addData };

        if (help.isNull(dataOdj)) {
          return;
        }

        dataOdj.dom_id = obj.domdata.dom_id;
        dataOdj.dom_nm = obj.domdata.dom_nm;

        setAddData(dataOdj);
      }
    } else if (obj.name === "AlertPop") {
      if (obj.callback === "handleHttp") {
        alertCallBack.current = "handleHttp";
      }
    } else if (obj.name === "ConfirmPop") {
      if (obj.callback === "Updata") {
        alertCallBack.current = "Updata";
      }
    }
  };

  useEffect(() => {
    if (alertCallBack.current === "handleHttp") {
      setPop(false);
      pop.handleHttp();
    } else if (alertCallBack.current === "Updata") {
      handleUpdateSubmit2();
    }

    alertCallBack.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertPop]);

  const handleUpdateSubmit = function () {
    let pop = {
      div: "ConfirmPop",
      data:
      <div><span>{addData.dic_log_nm}</span>도메인을 <br/><span>{addData.dom_nm}</span>(으)로 변경하시겠습니까?"</div>,
      callback: "Updata",
    };
    setAlertPop(pop);
  };

  const handleUpdateSubmit2 = async () => {
    const updataData = {
      dom_id: addData.dom_id,
      std_area_id: addData.std_area_id,
      dic_id: addData.dic_id,
      aval_end_dt: addData.aval_end_dt,
      aval_st_dt: addData.aval_st_dt,
    };

    let formData = JSON.stringify(updataData);

    try {
      setLoadingBar(true);
      const response = await axiosInstance.put(
        "/api/v1/stddic/updatedomofterm",
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
        let pop = {
          div: "AlertPop",
          data: "저장되었습니다.",
          callback: "handleHttp",
        };
        setAlertPop(pop);
      }
    } catch (error) {
      let pop = {
        div: "AlertPop",
        data: "도메인 수정 에러",
      };
      setAlertPop(pop);
      console.error("도메인 수정 에러:", error);
    } finally {
      setLoadingBar(false);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div className="popHead">
        <div className="title">도메인 수정</div>
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
          <p className="mainLabel">도메인</p>
        </div>
        <div className="main__wrap">
          <div className="gridInnerDiv">
            <table className="grid-container__table">
              <thead>
              </thead>
              <tbody>
                <tr>
                  <th className="essentialLabel"><p>용어 논리명</p></th>
                  <td>{!help.isNull(addData) ? addData.dic_log_nm : null}</td>
                </tr>
                <tr>
                  <th className="essentialLabel"><p>용어 물리명</p></th>
                  <td>{!help.isNull(addData) ? addData.dic_phy_nm : null}</td>
                </tr>
                <tr>
                  <th className="essentialLabel"><p>도메인</p></th>
                  <td>
                    <div className="TabAddDiv_buttomDiv_grid_domainDiv">
                      {!help.isNull(addData) ? <p>addData.dom_nm</p> : null}
                      <div
                        className="btn btn01"
                        onClick={(e) => {
                          let pop2 = {
                            width: 750,
                            height: 500,
                            div: "SearchDomainPop",
                          };

                          setPop2(pop2);
                        }}
                      >
                        다른 도메인 찾기&nbsp;<FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>용어 설명</th>
                  <td>
                    <textarea
                      disabled
                      value={!help.isNull(addData) ? addData.dic_desc || "" : ""}
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="button__wrap">
          <button
            className="btn"
            onClick={(e) => {
              handleUpdateSubmit(e);
            }}
          >
            용어 등록
          </button>
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
  );
}

export default DomainUpdatePop;
