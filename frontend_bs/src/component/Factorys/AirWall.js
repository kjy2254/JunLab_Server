import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePagination, useSortBy, useTable } from "react-table";
import "../../css/AirWall.css";
import { notify } from "../../util";

function AirWall(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    props.setHeaderText("로그 / 고정식");
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "이름",
        accessor: "module_name",
      },
      {
        Header: "온도",
        accessor: "temperature",
      },
      {
        Header: "TVOC",
        accessor: "tvoc",
      },
      {
        Header: "CO2",
        accessor: "co2",
      },
      {
        Header: "PM1.0",
        accessor: "pm1_0",
      },
      {
        Header: "PM2.5",
        accessor: "pm2_5",
      },
      {
        Header: "PM10",
        accessor: "pm10",
      },
      {
        Header: "TimeStamp",
        accessor: "timestamp",
      },
    ],
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="airwall">
      <div className="airwall-wrapper layer2">
        <span className="bar" />
        <div className="header">
          <span>고정식 로그 검색</span>
        </div>
        <DateAndTimeForm
          setData={setData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          data={data}
        />
        <MyTable columns={columns} data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function downloadCSV(data, filename) {
  let csvContent = "\uFEFF"; // UTF-8 BOM 추가

  // 헤더 추가
  const headers = Object.keys(data[0]);
  csvContent += headers.join(",") + "\r\n";

  // 데이터 행 추가, 특히 timestamp 형식화 적용
  data.forEach(function (row) {
    let rowData = headers.map((header) => {
      // timestamp 열에 대해 형식화 적용
      if (header === "timestamp") {
        return formatTimestamp(row[header]);
      } else {
        return row[header];
      }
    });
    let rowString = rowData.join(",");
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
  const [selected, setSelected] = useState({ type: "name", value: "전체" });

  useEffect(() => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/airwalls`)
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
      // alert("이전 요청이 실행 중 입니다.");
      notify();
      return;
    } else {
      setIsLoading(true);
      setData([]);
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/airwalldata?start=${startDate}&end=${endDate}&factoryId=${factoryId}&${selected.type}=${selected.value}`
        )
        .then((response) => {
          setIsLoading(false);
          // console.log(response.data);
          setData(response.data);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("API 요청 실패:", error);
        });
    }
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
              <option key={idx} value={e.module_name}>
                {e.module_name}
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

function MyTable({ columns, data, isLoading }) {
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

  return (
    <div className="table-pagenation">
      <div className="airwall-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                      <td {...cell.getCellProps()}>
                        {cell.column.id === "timestamp"
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

export default AirWall;
