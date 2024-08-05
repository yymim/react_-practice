import React, { useState, useEffect, useRef } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import help from "../../help.js";

import "../css/Common.css";
import "../css/Gridcomp.css";

const Gridcomp = function ({ initialData, format, sendDataToParent }) {
  const rowHeight = 28;
  const headerHeight = 40;

  const [griddata, setGridData] = useState(initialData);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [headerColumnWidths, setHeaderColumnWidths] = useState(
    format.colInfo.map((item) => item.size)
  );
  const [columnWidths, setColumnWidths] = useState(
    format.colInfo.map((item) => item.size)
  );
  const [rowPosition, setRowPosition] = useState(0);

  const gridRef = useRef(null);
  const bodyGridRef = useRef(null);
  const gridSort = useRef(null);
  const resizeIndexRef = useRef(null);
  const startXRef = useRef(null);
  const startWidthRef = useRef(null);
  const isDrag = useRef("auto");
  const colkeys = useRef(help.getKeys(griddata?.data));

  const [bodyTopScroll, setBodyTopScroll] = useState(0);
  const [bodyLeftScroll, setBodyLeftScroll] = useState(0);
  const [headerLeft, setHeaderLeft] = useState(null);

  useEffect(() => {
    if (sendDataToParent) {
      if (
        format.sort &&
        !help.isNull(griddata?.data) &&
        !help.isNull(rowPosition)
      ) {
        const originDataRow = griddata.data[rowPosition].rowindex;

        sendDataToParent({ name: "Gridcomp", rowposition: originDataRow });
        return;
      } else {
        sendDataToParent({ name: "Gridcomp", rowposition: rowPosition });
      }
    }

    return undefined;
  }, [format, griddata, rowPosition, sendDataToParent]);

  useEffect(() => {
    gridSort.current = null;

    if (!help.isNull(initialData)) {
      colkeys.current = help.getKeys(initialData.data);
      setRowPosition(0);
      bodyGridRef.current.scrollTo({ scrollTop: 0, scrollLeft: 0 });
      setGridData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    let arr = columnWidths;
    let leftArr = [];
    let widthArr = [];
    let leftValue = 0;
    let leftScroll = !help.isNull(bodyLeftScroll) ? bodyLeftScroll : 0;

    if (!help.isNull(columnWidths.length)) {
      for (let i = 0; i < columnWidths.length; i++) {
        if (i === 0) {
          leftArr.push(leftValue);
        } else {
          leftValue += arr[i - 1];
          leftArr.push(leftValue - leftScroll);
        }
      }

      if (leftScroll !== 0) {
        for (let i = 0; i < columnWidths.length; i++) {
          if (i === columnWidths.length - 1) {
            widthArr.push(columnWidths[i]);
          } else {
            widthArr.push(leftArr[i + 1] - leftArr[i]);
          }
        }
      } else {
        widthArr = [...arr];
      }
    }

    setHeaderLeft(leftArr);
    setHeaderColumnWidths(widthArr);
  }, [columnWidths, bodyLeftScroll]);

  const HeaderCell = ({ columnIndex, style, onMouseDown }) => (
    <div
      style={{
        ...style,
        boxSizing: "border-box",
        position: "absolute",
        userSelect: "none",
        width: !help.isNull(headerColumnWidths)
          ? headerColumnWidths[columnIndex]
          : columnWidths[columnIndex],
        zIndex: columnIndex,
        left: !help.isNull(headerLeft) ? headerLeft[columnIndex] : style.left,
        overflow: "hidden",
      }}
      className={"header-cell header-cell-" + columnIndex}
      onClick={(e) => {
        if (help.isNull(griddata) || griddata.data.length === 0) {
          return;
        }

        if (!format.sort) {
          return;
        }

        let newData = [...griddata.data];
        const key = Object.keys(newData[0])[columnIndex];
        let row = newData[rowPosition].rowindex;

        if (gridSort.current && gridSort.current.index === columnIndex) {
          if (gridSort.current.sort === "UP") {
            gridSort.current.sort = "DOWN";
            newData.reverse();
          } else if (gridSort.current.sort === "DOWN") {
            gridSort.current = null;
            newData.sort((a, b) => {
              if (
                typeof a.rowindex === "number" &&
                typeof b.rowindex === "number"
              ) {
                return a.rowindex - b.rowindex;
              } else {
                return String(a.rowindex).localeCompare(String(b.rowindex));
              }
            });
          }
        } else {
          gridSort.current = { index: columnIndex, sort: "UP" };
          newData.sort((a, b) => {
            if (typeof a[key] === "number" && typeof b[key] === "number") {
              return a[key] - b[key];
            } else {
              return String(a[key]).localeCompare(String(b[key]));
            }
          });
        }

        row = newData.findIndex((e) => e.rowindex === row);

        setRowPosition(row);

        bodyGridRef.current.scrollToItem({
          align: "auto ",
          rowIndex: row,
        });

        setGridData({ ...griddata, data: newData });
      }}
    >
      {!help.isNull(gridSort.current) && gridSort.current.index === columnIndex
        ? gridSort.current.sort === "UP"
          ? format.colInfo[columnIndex].name + " ▲"
          : format.colInfo[columnIndex].name + " ▼"
        : format.colInfo[columnIndex].name}
      <div
        className="resize-handle"
        onMouseDown={(e) => onMouseDown(e, columnIndex)}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "5px",
          cursor: "col-resize",
        }}
      />
    </div>
  );

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
    onMouseDown,
    onRowClick,
    isSelected,
  }) => (
    <div
      style={{
        ...style,
        userSelect: isDrag.current,
        backgroundColor: isSelected
          ? "#4d4d4d"
          : rowIndex % 2 === 0
          ? "#000"
          : "#111",
        color: isSelected
        ? "#fff"
        : "#9a9a9a",
      }}
      className={
        `cell ${rowIndex % 2 === 0 ? "even" : "odd"} ` +
        format.id +
        "" +
        rowIndex +
        "" +
        columnIndex
      }
      onClick={() => onRowClick(rowIndex)}
      onDoubleClick={() => {
        if (
          format.sort &&
          !help.isNull(griddata) &&
          !help.isNull(rowPosition)
        ) {
          const originDataRow = griddata.data[rowPosition].rowindex;

          typeof format.onDoubleClick === "function" &&
            format.onDoubleClick(griddata, originDataRow);
        } else {
          typeof format.onDoubleClick === "function" &&
            format.onDoubleClick(griddata, rowPosition);
        }
      }}
    >
      {help.isNull(format.colInfo[columnIndex].type) ||
      format.colInfo[columnIndex].type === "label" ? (
        <label style={{ whiteSpace: "nowrap" }}>
          {griddata.data[rowIndex][colkeys.current[columnIndex]]}
        </label>
      ) : !help.isNull(
          String(griddata.data[rowIndex][[colkeys.current[columnIndex]]])
        ) ? (
        <button
          index={rowIndex}
          className="btn Gird_button"
          onClick={(e) => {
            const targetId = e.target;
            let element = targetId;
            let findId = "";
            while (element && findId === "") {
              const findIndex = element.className.indexOf(
                format.id + "" + rowIndex + "" + columnIndex
              );
              if (findIndex !== -1) {
                findId = element.className.substring(
                  (format.id + "" + rowIndex + "" + columnIndex).length,
                  (format.id + "" + rowIndex + "" + columnIndex).length + 10
                );
              }
              element = element.parentElement;
            }

            if (
              format.sort &&
              !help.isNull(griddata) &&
              !help.isNull(rowPosition)
            ) {
              const originDataRow =
                griddata.data[e.target.getAttribute("index")].rowindex;

              sendDataToParent({
                name: "Gridcomp_button",
                rowposition: originDataRow,
                data: griddata.data,
                pop: true,
              });
              return;
            }

            sendDataToParent({
              name: "Gridcomp_button",
              rowposition: rowIndex,
              data: griddata.data,
              pop: true,
            });
          }}
          style={{ whiteSpace: "nowrap" }}
        >
          {/* 입력버튼 */}
          &nbsp;<FontAwesomeIcon style={{ pointerEvents: "none" }} icon="fa-solid fa-pen-to-square" />&nbsp;
        </button>
      ) : null}
      <div
        className="resize-handle"
        onMouseDown={(e) => onMouseDown(e, columnIndex)}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "5px",
          cursor: "col-resize",
        }}
      />
    </div>
  );

  const updateGridSize = () => {
    if (gridRef.current) {
      setGridSize({
        width: gridRef.current.clientWidth,
        height: gridRef.current.clientHeight - headerHeight,
      });
    }
  };

  useEffect(() => {
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  const getColumnWidth = (index) => columnWidths[index];
  const getHeaderColumnWidth = (index) => headerColumnWidths[index];

  const handleMouseDown = (e, index) => {
    isDrag.current = "none";
    resizeIndexRef.current = index;
    startXRef.current = e.clientX;
    startWidthRef.current = columnWidths[index];
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (resizeIndexRef.current !== null) {
      const newWidth = startWidthRef.current + e.clientX - startXRef.current;
      const newWidths = [...columnWidths];

      newWidths[resizeIndexRef.current] = newWidth;

      if (newWidths[resizeIndexRef.current] <= 0) {
        newWidths[resizeIndexRef.current] = 0;
      }

      setColumnWidths(newWidths);
      setHeaderColumnWidths(newWidths);
    }
  };

  const handleMouseUp = () => {
    isDrag.current = "auto";
    resizeIndexRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleRowClick = (rowIndex) => {
    setRowPosition(rowIndex);
  };

  const handleScroll = ({ scrollTop, scrollLeft }) => {
    setBodyTopScroll(scrollTop);
    setBodyLeftScroll(scrollLeft);
  };

  return (
    <div className="grid-container" ref={gridRef}>
      <div className="header">
        <Grid
          key={`header-${headerColumnWidths.join("-")}`}
          columnCount={headerColumnWidths.length}
          columnWidth={getHeaderColumnWidth}
          height={headerHeight}
          rowCount={1}
          rowHeight={() => headerHeight}
          width={gridSize.width}
          style={{ overflow: "hidden" }}
        >
          {({ columnIndex, rowIndex, style }) => (
            <HeaderCell
              columnIndex={columnIndex}
              style={style}
              onMouseDown={handleMouseDown}
            />
          )}
        </Grid>
      </div>
      <div className="body">
        <Grid
          className="grid-container__wrap"
          ref={bodyGridRef}
          key={`body-${columnWidths.join("-")}`}
          columnCount={columnWidths.length}
          columnWidth={getColumnWidth}
          height={gridSize.height}
          rowCount={!help.isNull(griddata) ? griddata.data?.length : 0}
          rowHeight={() => rowHeight}
          width={gridSize.width}
          onScroll={handleScroll}
          initialScrollTop={bodyTopScroll}
          initialScrollLeft={bodyLeftScroll}
        >
          {({ columnIndex, rowIndex, style }) => (
            <Cell
              columnIndex={columnIndex}
              rowIndex={rowIndex}
              style={style}
              onMouseDown={handleMouseDown}
              onRowClick={handleRowClick}
              isSelected={rowPosition === rowIndex}
            />
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Gridcomp;
