import {
  faSort,
  faSortDown,
  faSortUp,
  faUserCheck,
  faUserTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSortBy, useTable } from "react-table";
import "../../../css/Dashboard2.css";

function WorkerSummary({
  onlineData,
  setOnlineData,
  setModalOpen,
  setSelectedWorker,
}) {
  const { factoryId } = useParams();
  const [offlineData, setOfflineData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/workers`
        );
        const fetchedData = response.data;

        // 데이터를 online과 offline으로 분리
        const onlineWorkers = fetchedData.filter((worker) => worker.online);
        const offlineWorkers = fetchedData
          .filter((worker) => !worker.online)
          .map((worker) => ({
            ...worker,
            last_heart_rate: "-",
            last_body_temperature: "-",
            last_oxygen_saturation: "-",
            work_level: "-",
          }));

        setOnlineData(onlineWorkers);
        setOfflineData(offlineWorkers);
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, [factoryId]);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(); // 기본 로컬 시간 형식 사용
  }

  const columns = useMemo(
    () => [
      {
        Header: "작업자",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="table-worker">
            <img
              src={`http://junlab.postech.ac.kr:880/api2/image/${row.original.profile_image_path}`}
              width={50}
              height={50}
            />
            <div className="info">
              <span className="name">{row.original.name}</span>
              <span className="watch">
                Watch: {row.original.watch_id || "-"}
              </span>
              <span className="watch">
                AirWall: {row.original.airwall_id || "-"}
              </span>
            </div>
          </div>
        ),
      },
      {
        Header: "심박수(bpm)",
        accessor: "last_heart_rate",
        Cell: ({ row }) =>
          row.original.online ? (
            <div className="left">{row.original.last_heart_rate}</div>
          ) : (
            <div className="left">-</div>
          ),
      },
      {
        Header: "체온(°C)",
        accessor: "last_body_temperature",
        Cell: ({ row }) =>
          row.original.online ? (
            <div className="left">{row.original.last_body_temperature}</div>
          ) : (
            <div className="left">-</div>
          ),
      },
      {
        Header: "산소포화도(%)",
        accessor: "last_oxygen_saturation",
        Cell: ({ row }) =>
          row.original.online ? (
            <div className="left">
              {isNaN(parseInt(row.original.last_oxygen_saturation))
                ? "-"
                : parseInt(row.original.last_oxygen_saturation)}
            </div>
          ) : (
            <div className="left">-</div>
          ),
      },
      {
        Header: "위험단계",
        accessor: "workload",
        Cell: ({ row }) => (
          <div>
            {row.original.online ? (
              <div className={"level lv" + row.original.workload}>
                {row.original.workload}단계
              </div>
            ) : (
              <div>-</div>
            )}
          </div>
        ),
      },
      {
        Header: "착용 상태",
        accessor: "online",
        Cell: ({ row }) => (
          <div
            className="state"
            title={`마지막 동기화: ${formatTimestamp(row.original.last_sync)}`}
          >
            <div>
              {row.original.online ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <circle cx="6.5" cy="6.5" r="6.5" fill="#81FF02" />
                  </svg>
                  Online
                </>
              ) : (
                <>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                    >
                      <circle cx="6.5" cy="6.5" r="6.5" fill="#FF0000" />
                    </svg>
                    Offline
                  </div>
                </>
              )}
            </div>
            <div>
              {row.original.last_wear ? (
                <>
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    style={{ color: "#81FF02" }}
                  />
                  착용중
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faUserTimes}
                    style={{ color: "#FF0000" }}
                  />
                  미착용
                </>
              )}
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: [...onlineData, ...offlineData], autoResetSortBy: false },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="worker-summary layer2">
      <span className="bar" />
      <div className="header">
        <span>
          작업자 상태
          {/* <a href="tel:01022540504"> 전화걸기 </a> */}
        </span>
      </div>
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
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => {
                  setModalOpen(true);
                  setSelectedWorker(row.original.user_id);
                }}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default WorkerSummary;
