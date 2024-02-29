import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTable, usePagination, useSortBy } from "react-table";
import "../../css/Logs.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { notify } from "../../util";

function Logs(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    props.setHeaderText("로그");
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
      },
      {
        Header: "BATT",
        accessor: "BATT",
      },
      {
        Header: "MAGx",
        accessor: "MAGx",
      },
      {
        Header: "MAGy",
        accessor: "MAGy",
      },
      {
        Header: "MAGz",
        accessor: "MAGz",
      },
      {
        Header: "ZYROx",
        accessor: "ZYROx",
      },
      {
        Header: "ZYROy",
        accessor: "ZYROy",
      },
      {
        Header: "ZYROz",
        accessor: "ZYROz",
      },
      {
        Header: "ACCx",
        accessor: "ACCx",
      },
      {
        Header: "ACCy",
        accessor: "ACCy",
      },
      {
        Header: "ACCz",
        accessor: "ACCz",
      },
      {
        Header: "AQI",
        accessor: "AQI",
      },
      {
        Header: "TVOC",
        accessor: "TVOC",
      },
      {
        Header: "EC2",
        accessor: "EC2",
      },
      {
        Header: "PM1.0",
        accessor: "PM10",
      },
      {
        Header: "PM2.5",
        accessor: "PM25",
      },
      {
        Header: "PM10",
        accessor: "PM100",
      },
      {
        Header: "IRUN",
        accessor: "IRUN",
      },
      {
        Header: "RED",
        accessor: "RED",
      },
      {
        Header: "ECG",
        accessor: "ECG",
      },
      {
        Header: "TEMP",
        accessor: "TEMP",
      },
      {
        Header: "CREATED_AT",
        accessor: "CREATED_AT",
      },
    ],
    []
  );

  const hiddenColumns = [
    "MAGx",
    "MAGy",
    "MAGz",
    "ZYROx",
    "ZYROy",
    "ZYROz",
    "ACCx",
    "ACCy",
    "ACCz",
  ];

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="logs">
      <div className="logs-wrapper layer2">
        <span className="bar" />
        <div className="header">
          <span>로그 검색</span>
        </div>
        <DateAndTimeForm
          setData={setData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          data={data}
        />
        <MyTable
          columns={columns}
          data={data}
          hiddenColumns={hiddenColumns}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function downloadCSV(data, filename) {
  let csvContent = "\uFEFF"; // UTF-8 BOM 추가

  // 헤더 추가
  csvContent += Object.keys(data[0]).join(",") + "\r\n";

  // 데이터 행 추가
  data.forEach(function (row) {
    let rowString = Object.values(row).join(",");
    csvContent += rowString + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function DateAndTimeForm({ setData, isLoading, setIsLoading, data }) {
  const { factoryId } = useParams();
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState({ type: "id", value: "전체" });

  useEffect(() => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/logs`)
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, []);

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getFormattedDate(new Date());

  const [startDate, setStartDate] = useState(today + " 00:00:00");
  const [endDate, setEndDate] = useState(today + " 23:59:59");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) {
      notify();
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    // 차이가 1주일을 초과하는지 확인
    if (diff > oneWeek) {
      alert("검색 기간은 최대 1주일까지만 가능합니다.");
      return;
    }

    // 로딩 상태 설정 및 기존 데이터 초기화
    setIsLoading(true);
    setData([]);

    axios
      .get(
        `http://junlab.postech.ac.kr:880/api2/factory/logs?start=${startDate}&end=${endDate}&id=${selected.value}`
      )
      .then((response) => {
        setIsLoading(false);
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("API 요청 실패:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="date">
        <label>
          <span>시작 날짜:</span>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          <span>끝 날짜:</span>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <div className="options">
        <div className="type-area">
          <select
            onChange={(e) =>
              setSelected({ ...selected, value: e.target.value })
            }
          >
            <option value="전체">전체</option>
            {list.map((e, idx) => (
              <option key={idx} value={e.ID}>
                {e.ID}
              </option>
            ))}
          </select>
        </div>
        <div className="buttons">
          <button type="submit" className="search" onClick={handleSubmit}>
            검색
          </button>
          <button
            type="button"
            className="download"
            onClick={() => downloadCSV(data, "data.csv")}
          >
            다운로드
          </button>
        </div>
      </div>
    </form>
  );
}

function MyTable({ columns, data, hiddenColumns, isLoading }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // 페이지별 행 데이터
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  const [inputPageIndex, setInputPageIndex] = useState(pageIndex + 1);

  const handleInputChange = (e) => {
    // 입력값이 숫자인 경우에만 pageIndex 업데이트
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setInputPageIndex(value);
    }
  };

  const handleInputBlur = () => {
    // pageIndex 업데이트 후 페이지 이동
    const newPageIndex = inputPageIndex - 1;
    if (newPageIndex >= 0 && newPageIndex < pageOptions.length) {
      gotoPage(newPageIndex);
    } else {
      // 유효하지 않은 페이지 번호인 경우, 현재 페이지로 복원
      setInputPageIndex(pageIndex + 1);
    }
  };

  useEffect(() => {
    setInputPageIndex(pageIndex + 1);
  }, [pageIndex]);

  function getClassName(columnId, hiddenColumns) {
    return hiddenColumns.includes(columnId) ? (
      "hide"
    ) : (
      <FontAwesomeIcon icon="fa-solid fa-sort" />
    );
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(); // 기본 로컬 시간 형식 사용
  }

  return (
    <div className="table-pagenation">
      <div className="logs-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={getClassName(column.id, hiddenColumns)}
                  >
                    {column.render("Header")} &nbsp;
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FontAwesomeIcon icon={faSortDown} />
                        ) : (
                          <FontAwesomeIcon icon={faSortUp} />
                        )
                      ) : (
                        <FontAwesomeIcon icon={faSort} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={getClassName(cell.column.id, hiddenColumns)}
                      >
                        {cell.column.id === "CREATED_AT"
                          ? formatTimestamp(cell.value)
                          : cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isLoading ? <div id="spinner" /> : ""}
      <div className="pagination">
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
        </div>
        <div className="info">
          <span>
            Page &nbsp;
            <input
              type="number"
              min="1"
              max={pageOptions.length}
              value={inputPageIndex}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            &nbsp; of {pageOptions.length}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} rows
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logs;
