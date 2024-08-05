const hi = function (data, code, row) {
  var test;
  var arr = [];

  Object.keys(data).forEach((key) => {
    test = data[key];
    arr.push(test[code]);
  });

  if (isNull(row)) {
    return arr;
  } else {
    return arr[row];
  }
};

const getKeys = function (data) {
  if (isNull(data)) return;
  const allKeys = new Set();

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      allKeys.add(key);
    });
  });

  const uniqueKeys = Array.from(allKeys);
  return uniqueKeys;
};

const getRow = function (data, row) {
  if (isNull(data)) return;
  var keys = getKeys(data);
  var datas = data[row];
  var arr = [];

  for (let i = 0; i < keys.length; i++) {
    arr.push({ key: keys[i], value: datas[keys[i]] });
  }

  return arr;
};

const getColumn = function (data, row, code) {
  if (isNull(data)) return;
  var col = getRow(data, row);
  var value;

  for (let i = 0; i < col.length; i++) {
    if (col[i].key === code) {
      value = col[i].value;
      break;
    }
  }

  return !code ? null : value;
};

const axiosData = function (obj) {
  let filteredData;

  const objectData = obj.data.map((a, item) => {
    a[item.id] = item;
    return a;
  }, {});

  let col = [];
  for (let i = 0; i < obj.colInfo.length; i++) {
    col.push(obj.colInfo[i].col);
  }

  if (col) {
    filteredData = objectData
      .filter((item) => col.map((key) => item.hasOwnProperty(key)))
      .map((item, index) => {
        let newObj = {};
        col.forEach((key) => {
          if (String(key).indexOf("nodata") !== -1) {
            newObj[key] = "button";
          } else {
            newObj[key] = item[key];
          }
        });
        newObj.rowindex = index;
        return newObj;
      });
  } else {
    filteredData = objectData;
  }

  const allKeys = new Set();

  filteredData.forEach((item) => {
    Object.keys(item).forEach((key) => {
      allKeys.add(key);
    });
  });

  const uniqueKeys = Array.from(allKeys);
  const newCols = Number(uniqueKeys.length);

  const returnValue = {
    data: filteredData,
    keys: uniqueKeys,
    cols: newCols,
  };

  return returnValue;
};

const isNull = function (value) {
  if (value === "" || value === null || value === undefined) {
    return true;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  return false;
};

const nvl = function (value1, value2) {
  if (isNull(value1)) {
    return value2;
  } else {
    return value1;
  }
};

const getDomainInfo = function (a, type) {
  let logic = "";

  if (!isNull(a)) {
    a.forEach((item, index) => {
      let dep = type === "dic_phy_nm" ? "_" : "";
      if (index === a.length - 1) dep = "";
      logic += (item[type] || "") + dep;
    });
  }

  return logic;
};

const checkData = function (checkObj, textObj) {
  for (let key in checkObj) {
    if (isNull(checkObj[key])) {
      alert(textObj[key] + "을(를) 확인해주세요.");
      return false;
    }
  }
  return true;
};

const findSortRow = function (dataObj) {
  const originDataRow = dataObj.data.rowindex;

  if (!originDataRow) {
    return undefined;
  }

  return originDataRow;
};

const trace = function (text) {
  console.log(text);
  return text;
};

const help = {
  hi,
  getKeys,
  getRow,
  getColumn,
  isNull,
  axiosData,
  getDomainInfo,
  checkData,
  nvl,
  findSortRow,
  trace,
};

export default help;
