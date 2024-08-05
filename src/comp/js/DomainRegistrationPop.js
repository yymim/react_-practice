import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import AlertPop from "./Pop.js";
import myGif from "../../loading.gif";
import help from "../../help.js";

import "../css/Common.css";
import "../css/Pop.css";
import "../css/Gridcomp.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function DomainRegistrationPop({ pop, setPop, sendDataToParent }) {
  const [loadingBar, setLoadingBar] = useState(false);
  const [data, setData] = useState({
    dom_nm: null,
    key_dom_nm: null,
    dom_grp_id: "fb09a888-ea38-4bab-9521-8403deb77f1a",
    dom_type_cd: "0001",
    data_type_cd: "0001",
    data_len: null,
    data_scale: null,
    data_min: null,
    data_max: null,
    data_format: null,
    dom_desc: null,
  });

  const [alertPop, setAlertPop] = useState(false);

  const [domainGroupCombo, setDomainGroupCombo] = useState({});
  const [domainTypeCombo, setDomainTypeCombo] = useState({});
  const [dataTypeCombo, setDataTypeCombo] = useState({});

  useEffect(() => {
    getComboData({
      name: "domainGroupCombo",
      fn: setDomainGroupCombo,
      colInfo: [{ col: "dom_grp_id" }, { col: "dom_grp_nm" }],
      url: "/api/v1/stddom/searchdomgrp",
    });
    getComboData({
      name: "domainTypeCombo",
      colInfo: [{ col: "cd_id" }, { col: "cd_nm" }],
      fn: setDomainTypeCombo,
      url: "/api/v1/stddom/searchdomtype",
    });
    getComboData({
      name: "dataTypeCombo",
      colInfo: [{ col: "cd_no" }, { col: "data_type" }],
      fn: setDataTypeCombo,
      url: "/api/v1/stddom/searchdatatype",
    });
  }, []);

  useEffect(() => {
    if (pop.id === "TabDomainUpdata") {
      const dataObj = {
        std_area_id: pop.data.std_area_id,
        dom_id: pop.data.dom_id,
        aval_end_dt: pop.data.aval_end_dt,
        aval_st_dt: pop.data.aval_st_dt,
        dom_nm: pop.data.dom_nm,
        org_dom_nm: pop.data.org_dom_nm,
        key_dom_nm: pop.data.key_dom_nm,
        dom_grp_id: pop.data.dom_grp_id,
        dom_type_cd: pop.data.dom_type_cd,
        data_type_cd: pop.data.data_type_cd,
        data_len: pop.data.data_len,
        data_scale: pop.data.data_scale,
        data_min: pop.data.data_min,
        data_max: pop.data.data_max,
        data_format: pop.data.data_format,
        dom_desc: pop.data.dom_desc,
      };
      setData(dataObj);
    }
  }, [pop]);

  const getComboData = function (obj) {
    setLoadingBar(true);
    axiosInstance
      .get(obj.url)
      .then((response) => {
        const arrayData = response.data;

        const axiosData = {
          id: "ComboData",
          data: arrayData,
          colInfo: obj.colInfo,
        };

        const objData = help.axiosData(axiosData).data;

        const arr = [];

        objData.forEach((item, index) => {
          arr.push(
            <option
              key={obj.name + "-row" + index}
              value={item[obj.colInfo[0].col]}
            >
              {item[obj.colInfo[1].col]}
            </option>
          );
        });

        obj.fn(arr);
      })
      .catch((error) => {
        let pop = {
          div: "AlertPop",
          data: "데이터를 받아 올 수 없습니다.",
        };
        setAlertPop(pop);
        console.error("데이터를 받아올 수 없음.", error);
      })
      .finally(() => {
        setLoadingBar(false);
      });
  };

  const handleDataChange = function (e, name) {
    const obj = { ...data };
    obj[name] = e.target.value;
    setData(obj);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.dom_nm) {
      let pop = {
        div: "AlertPop",
        data: "도메인명을 확인해주세요.",
      };
      setAlertPop(pop);
      return;
    }

    if (!data.key_dom_nm) {
      let pop = {
        div: "AlertPop",
        data: "대표도메인명을 확인해주세요.",
      };
      setAlertPop(pop);
      return;
    }

    let formData = JSON.stringify(data);

    try {
      setLoadingBar(true);
      let response;
      if (!help.isNull(pop.data)) {
        response = await axiosInstance.put(
          "/api/v1/stddom/updatedom",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axiosInstance.post(
          "/api/v1/stddom/insertdom",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!help.isNull(response.data?.status) && response.data?.status === -1) {
        let pop = {
          div: "AlertPop",
          data: response.data.message,
        };
        setAlertPop(pop);
      } else {
        sendDataToParent({
          name: "DomainRegistrationPop",
          data: data.dom_nm,
        });

        setPop(false);
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
    <div
      className="DomainRegistrationPop"
      style={{ height: "100%" }}
    >
      <div className="popHead">
        <div className="title">
          {!help.isNull(pop.id) && pop.id === "TabDomainUpdata"
            ? "도메인 수정"
            : "도메인 등록"}
        </div>
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
          <label className="mainLabel">도메인데이터</label>
        </div>
        <div className="main__wrap">
          <table className="grid-container__table">
            <thead></thead>
            <tbody>
              <tr>
                <th className="essentialLabel"><p>도메인명</p></th>
                <td>
                  <input
                    value={data.dom_nm || ""}
                    onChange={(e) => handleDataChange(e, "dom_nm")}
                    onBlur={(e) => {
                      if (help.isNull(data.key_dom_nm)) {
                        const obj = { ...data };
                        obj.key_dom_nm = e.target.value;
                        setData(obj);
                      }
                    }}
                    type="text"
                  ></input>
                </td>
              </tr>
              <tr>
                <th className="essentialLabel"><p>대표도메인명</p></th>
                <td className={!help.isNull(pop.data) ? "disabled" : ""}>
                  <input
                    disabled={!help.isNull(pop.data) ? true : false}
                    value={data.key_dom_nm || ""}
                    onChange={(e) => handleDataChange(e, "key_dom_nm")}
                    type="text"
                  ></input>
                </td>
              </tr>
              <tr>
                <th className="essentialLabel"><p>도메인 그룹</p></th>
                <td>
                  <select
                    value={data.dom_grp_id || ""}
                    onChange={(e) => {
                      handleDataChange(e, "dom_grp_id");
                    }}
                  >
                    {!help.isNull(domainGroupCombo) ? domainGroupCombo : null}
                  </select>
                </td>
              </tr>
              <tr>
                <th className="essentialLabel"><p>유형</p></th>
                <td>
                  <select
                    value={data.dom_type_cd || ""}
                    onChange={(e) => {
                      handleDataChange(e, "dom_type_cd");
                    }}
                  >
                    {!help.isNull(domainTypeCombo) ? domainTypeCombo : null}
                  </select>
                </td>
              </tr>
              <tr>
                <th className="essentialLabel"><p>데이터타입</p></th>
                <td>
                  <select
                    value={data.data_type_cd || ""}
                    onChange={(e) => {
                      handleDataChange(e, "data_type_cd");
                    }}
                  >
                    {!help.isNull(dataTypeCombo) ? dataTypeCombo : null}
                  </select>
                </td>
              </tr>
              <tr>
                <th>길이</th>
                <td>
                  <input
                    value={data.data_len || ""}
                    onChange={(e) => handleDataChange(e, "data_len")}
                    type="text"
                  ></input>
                </td>
              </tr>
              <tr>
                <th>소수</th>
                <td>
                  <input
                    value={data.data_scale || ""}
                    onChange={(e) => handleDataChange(e, "data_scale")}
                    type="text"
                  ></input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="top__wrap"
          style={{ paddingTop: "0px" }}>
          <label className="mainLabel">도메인 기타</label>
        </div>
        <div className="main__wrap">
          <table className="grid-container__table">
            <thead></thead>
            <tbody>
              <tr>
                <th>데이터범위 최소</th>
                <td>
                  <input
                    value={data.data_min || ""}
                    onChange={(e) => handleDataChange(e, "data_min")}
                    type="text"
                  ></input>
                </td>
              </tr>
              <tr>
                <th>데이터범위 최대</th>
                <td>
                  <input
                    value={data.data_max || ""}
                    onChange={(e) => handleDataChange(e, "data_max")}
                    type="text"
                  ></input>
                </td>
              </tr>
              <tr>
                <th>데이터포맷</th>
                <td>
                  <input
                    value={data.data_format || ""}
                    onChange={(e) => handleDataChange(e, "data_format")}
                    type="text"
                  ></input>
                </td>
              </tr>
              <tr>
                <th rowSpan={2}>설명</th>
                <td rowSpan={2}>
                  <textarea
                    value={data.dom_desc || ""}
                    onChange={(e) => handleDataChange(e, "dom_desc")}
                  ></textarea>
                </td>
              </tr>
              <tr></tr>
            </tbody>
          </table>
        </div>
        <div className="button__wrap" style={{ paddingTop: "20px"}}>
          <button
            className="btn btn01"
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
          <AlertPop pop={alertPop} setPop={setAlertPop}></AlertPop>
        ) : null}
      </div>
    </div>
  );
}

export default DomainRegistrationPop;
