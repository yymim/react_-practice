import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import AlertPop from "./Pop.js";
import myGif from "../../loading.gif";

import "../css/Common.css";
import "../css/Tab.css";

import help from "../../help.js";
import Gridcomp from "./Gridcomp.js";
import Pop from "./Pop.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function TabAdd({ http, handleHttp }) {
  const [loadingBar, setLoadingBar] = useState(false);

  const [alertPop, setAlertPop] = useState(false);
  const alertCallBack = useRef(null);

  const [pop, setPop] = useState(false);
  const [pop2, setPop2] = useState(false);
  const [addData, setAddData] = useState({});

  const grid = useRef({
    id: "TabAdd",
    colInfo: [
      { name: "순서", col: "order_no", size: 50 },
      { name: "논리명", col: "str", size: 250 },
      { name: "물리명", col: "dic_phy_nm", size: 200 },
      { name: "입력", col: "new_yn", type: "button", size: 100 },
      { name: "엔터티분류", col: "ent_clss_yn", size: 145 },
      { name: "속성분류", col: "attr_clss_yn", size: 90 },
    ],
  });

  const handleDataFromChild = (obj) => {
    if (obj.name === "SearchDomainPop") {
      if (!help.isNull(obj.domdata)) {
        const dataOdj = addData;

        if (help.isNull(dataOdj)) {
          return;
        }

        dataOdj.domdata.dom_id = obj.domdata.dom_id;
        dataOdj.domdata.dom_nm = obj.domdata.dom_nm;

        setAddData(dataOdj);
      }
    } else if (obj.name === "Gridcomp_button") {
      if (obj.pop) {
        let pop = {
          width: "400px",
          height: "470px",
          data: obj.data[obj.rowposition],
          div: "RegisterWordsPop",
        };

        setPop(pop);
      }
    } else if (obj.name === "AlertPop") {
      if (obj.callback === "handleHttp") {
        alertCallBack.current = "handleHttp";
      }
    }
  };

  const alertData = function (data, callback) {
    let pop = {
      div: "AlertPop",
      data: data,
      callback: callback,
    };
    setAlertPop(pop);
  };

  const phyCheckSave = function (str) {
    if (str.indexOf("_") === 0) {
      alertData("모든 단어에 물리명이 필요합니다.");
      return false;
    } else if (str.indexOf("_") === -1) {
      alertData("두 개 이상의 단어가 필요합니다.");
      return false;
    } else if (str.lastIndexOf("_") === str.length - 1) {
      alertData("모든 단어에 물리명이 필요합니다.");
      return false;
    } else if (str.lastIndexOf("__") !== -1) {
      alertData("모든 단어에 물리명이 필요합니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    if (help.isNull(addData.origindata)) {
      alertData("용어가 없습니다.");
      return;
    }

    const wordiddata = [];
    addData.origindata.forEach((item) => {
      wordiddata.push({
        word_id: item.dic_id,
        order_no: item.order_no,
      });
    });

    const dataObj = {
      dic_log_nm: addData.dic_log_nm,
      dic_phy_nm: addData.dic_phy_nm,
      dom_id: addData.domdata.dom_id,
      word_combi: wordiddata,
    };

    if (!phyCheckSave(dataObj.dic_phy_nm)) {
      return;
    }

    // if (
    //   help.isNull(
    //     addData.origindata[addData.origindata.length - 1]?.attr_clss_yn
    //   )
    // ) {
    //   alertData("속성 분류어로 끝나야 합니다.");
    //   return;
    // }

    if (help.isNull(dataObj.dic_log_nm)) {
      alertData("논리명을(를) 확인해주세요.");
      return;
    }

    if (help.isNull(dataObj.dic_phy_nm)) {
      alertData("물리명을(를) 확인해주세요.");
      return;
    }

    if (help.isNull(dataObj.dom_id)) {
      alertData("도메인을(를) 확인해주세요.");
      return;
    }

    if (help.isNull(dataObj.word_combi)) {
      alertData("용어구성정보을(를) 확인해주세요.");
      return;
    }

    dataObj.dic_desc = addData.dic_desc;

    let formData = JSON.stringify(dataObj);

    try {
      setLoadingBar(true);
      const response = await axiosInstance.post(
        "/api/v1/stddic/insertterm",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!help.isNull(response.data?.status) && response.data?.status === -1) {
        alertData(response.data.message);
      } else {
        alertData("저장되었습니다", "handleHttp");
      }
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

  useEffect(() => {
    if (alertCallBack.current === "handleHttp") {
      handleHttp();
    }

    alertCallBack.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertPop]);

  useEffect(() => {
    if (pop) {
      return;
    }

    if (http) {
      let url = "/api/v1/stddic/searchwordntmpword?dicLogNm=" + http;
      setLoadingBar(true);
      axiosInstance
        .get(url)
        .then((response) => {
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
            dic_log_nm: help.getDomainInfo(objData.data, "str"),
            dic_phy_nm: help.getDomainInfo(objData.data, "dic_phy_nm"),
            dic_desc: null,
            domdata: {
              dom_id: response.data[response.data.length - 1].dom_id,
              dom_nm: !help.isNull(
                response.data[response.data.length - 1].dom_id
              )
                ? response.data[response.data.length - 1].dic_log_nm
                : null,
            },
          };

          setAddData(dataObj);
        })
        .catch((error) => {
          let pop = {
            div: "AlertPop",
            data: "데이터를 받아올 수 없습니다.",
          };
          setAlertPop(pop);
          console.error("신규 데이터를 받아올 수 없음.", error);
        })
        .finally(() => {
          setLoadingBar(false);
        });
    }
  }, [http, pop]);

  return (
    <div className="TabSearchDiv tab02">
      <div
        className="TabSearchDiv__wrap"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <label className="mainLabel">
          분석 정보
          <p className="mainLabel_side__text">
            {!help.isNull(addData)
              ? Number(addData.data?.length) !== 0
              ? Number(addData.data?.length) + " 건"
              : null
              : null}
          </p>
        </label>
      </div>
      <div className="gridInnerDiv grid01">
        {!help.isNull(addData) ? (
          <Gridcomp
            initialData={addData}
            format={grid.current}
            sendDataToParent={handleDataFromChild}
          ></Gridcomp>
        ) : (
          <Gridcomp format={grid.current}></Gridcomp>
        )}
      </div>
      <div className="TabAddDiv_buttomDiv">
        <label className="mainLabel">용어 정보</label>
        <div className="gridInnerDiv grid02">
          <table className="grid-container__table">
            <colgroup>
              <col width="150px"/>
              <col width=""/>
            </colgroup>
            <thead>
            </thead>
            <tbody>
              <tr>
                <th className="essentialLabel"><p>용어 논리명</p></th>
                <td>
                  {!help.isNull(addData.dic_log_nm) ? addData.dic_log_nm : null}
                </td>
              </tr>
              <tr>
                <th className="essentialLabel"><p>용어 물리명</p></th>
                <td>
                  {!help.isNull(addData.dic_phy_nm) ? addData.dic_phy_nm : null}
                </td>
              </tr>
              <tr>
                <th className="essentialLabel"><p>도메인</p></th>
                <td>
                  <div className="TabAddDiv_buttomDiv_grid_domainDiv">
                    {!help.isNull(addData.domdata) ? <p>{addData.domdata.dom_nm}</p> : null}
                    <div
                      className="btn btn01"
                      onClick={(e) => {
                        let pop2 = {
                          width: "720px",
                          height: "500px",
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
                <th rowSpan={2}>용어 설명</th>
                <td rowSpan={2}>
                  <textarea
                    value={
                      !help.isNull(addData.dic_desc)
                        ? addData.dic_desc || ""
                        : ""
                    }
                    onChange={(e) => {
                      const obj = { ...addData };
                      obj.dic_desc = e.target.value;
                      setAddData(obj);
                    }}
                  ></textarea>
                </td>
              </tr>
              <tr></tr>
              <tr>
                <th>용어등록</th>
                <td>
                  <div className="TabAddDiv_buttomDiv_grid_domainDiv">
                    <div
                      className="btn btn01"
                      onClick={(e) => {
                        handleSubmit(e);
                      }}
                    >
                      용어 등록&nbsp;<FontAwesomeIcon icon="fa-solid fa-download" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          style={{
            width: "100%",
            height: "20px",
          }}
        ></div>
      </div>
      {pop ? (
        <Pop
          pop={pop}
          setPop={setPop}
          sendDataToParent={handleDataFromChild}
        ></Pop>
      ) : null}
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

export default TabAdd;
