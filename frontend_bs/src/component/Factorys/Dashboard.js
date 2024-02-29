import {
  faBatteryThreeQuarters,
  faPause,
  faPlay,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSortBy, useTable } from "react-table";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../css/Dashboard.css";
import co2 from "../../image/co2.svg";
import finedust from "../../image/finedust.svg";
import defaultProfile from "../../image/profile_default.png";
import temperature from "../../image/temperature.svg";
import tvoc from "../../image/tvoc.svg";
import EnvModal from "./EnvModal";
import WorkerModal from "./WorkerModal";

function Dashboard(props) {
  const [onlineData, setOnlineData] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [envModalOpen, setEnvModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(0);
  const [selectedEnvCard, setSelectedEnvCard] = useState(0);
  const [img, setImg] = useState();

  const envCardsData = [
    { title: "TVOC", unit: "ppb", endpoint: "tvoc", img: tvoc },
    { title: "CO2", unit: "ppb", endpoint: "co2", img: co2 },
    {
      title: "Temperature",
      unit: "°C",
      endpoint: "temperature",
      img: temperature,
    },
    { title: "Fine Dust", unit: "㎍/㎥", endpoint: "finedust", img: finedust },
  ];

  const handlePlayPause = () => {
    setIsPaused((p) => !p);
  };
  useEffect(() => {
    props.setHeaderText("통합상황판");
  }, []);

  useEffect(() => {
    if (envModalOpen || workerModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [envModalOpen, workerModalOpen]); // 모달 상태가 변경될 때마다 실행

  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <div className="play-pause">
          <div title="자동 슬라이드">
            {isPaused ? (
              <FontAwesomeIcon icon={faPlay} onClick={handlePlayPause} />
            ) : (
              <FontAwesomeIcon icon={faPause} onClick={handlePlayPause} />
            )}
          </div>
        </div>
        <div className="first-row">
          {envCardsData.map((data) => (
            <EnvCard
              key={data.endpoint}
              title={data.title}
              unit={data.unit}
              endpoint={data.endpoint}
              img={data.img}
              isPaused={isPaused}
              setSelectedEnvCard={setSelectedEnvCard}
              setEnvModalOpen={setEnvModalOpen}
              setImg={setImg}
            />
          ))}
        </div>
        <div className="second-row">
          <WorkerSummary
            onlineData={onlineData}
            setOnlineData={setOnlineData}
            setModalOpen={setWorkerModalOpen}
            setSelectedWorker={setSelectedWorker}
          />
          <WorkerStatistic data={onlineData} />
        </div>
        <div className="third-row">
          <Advice />
        </div>
        <WorkerModal
          modalOpen={workerModalOpen}
          setModalOpen={setWorkerModalOpen}
          selectedWorker={selectedWorker}
        />
        <EnvModal
          modalOpen={envModalOpen}
          setModalOpen={setEnvModalOpen}
          selectedEnvCard={selectedEnvCard}
          img={img}
        />
      </div>
    </div>
  );
}

function EnvCard({
  title,
  unit,
  endpoint,
  img,
  isPaused,
  setSelectedEnvCard,
  setEnvModalOpen,
  setImg,
}) {
  const { factoryId } = useParams();
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      if (isPaused) {
        swiper.autoplay.stop();
      } else {
        swiper.autoplay.start();
      }
    } else {
    }
  }, [isPaused]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/${endpoint}`
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, []);

  const [displayValue, setDisplayValue] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      const newValue = data[index][endpoint];
      if (displayValue != newValue) {
        setFade(true);
        setTimeout(() => {
          setFade(false);
          setDisplayValue(newValue);
        }, 300);
      }
    }
  }, [data, displayValue]);

  const settings = {
    spaceBetween: 20,
    slidesPerView: 1,
    onSlideChange: (swiper) => setIndex(swiper.realIndex),
    pagination: {
      clickable: true,
    },
    autoplay: {
      delay: 14000, // 5초 간격
      disableOnInteraction: true, // 사용자 상호작용 후에도 계속 재생
    },
    modules: [Pagination, Autoplay],
  };

  return (
    <div className="env-card layer2">
      <span className="bar" />
      <img
        title="그래프 보기"
        src={img}
        alt={title}
        onClick={() => {
          setEnvModalOpen(true);
          setSelectedEnvCard(endpoint);
          setImg(img);
        }}
      />
      {data.length > 0 && (
        <Swiper
          {...settings}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data.length > 0 &&
            data.map((e, idx) => (
              <SwiperSlide key={idx} className="text">
                <span className="title">{title}</span>
                <span className={`value ${fade ? "fade-out" : "fade-in"}`}>
                  {new Date() - new Date(e.last_update) < 30000
                    ? e[endpoint] + unit
                    : "Offline"}
                </span>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
      {data.length == 0 && (
        <div className="text">
          <span className="title">{title}</span>
          <span className={`value ${fade ? "fade-out" : "fade-in"}`}>-</span>
        </div>
      )}
      <div title={data[index]?.module_description} className="module-name">
        {data[index]?.module_name}
      </div>
    </div>
  );
}

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
            <img src={defaultProfile} width={42} height={42} />
            <div className="info">
              <span className="name">{row.original.name}</span>
              <span className="watch">
                Watch: {row.original.watch_id || "-"}
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
              {parseInt(row.original.last_oxygen_saturation)}
            </div>
          ) : (
            <div className="left">-</div>
          ),
      },
      {
        Header: "위험도",
        accessor: "work_level",
        Cell: ({ row }) => (
          <div>
            {row.original.online ? (
              <div className={"level lv" + row.original.work_level}>
                {row.original.work_level}단계
              </div>
            ) : (
              <div>-</div>
            )}
          </div>
        ),
      },
      {
        Header: "상태",
        accessor: "online",
        Cell: ({ row }) => (
          <div
            className="state"
            title={`마지막 동기화: ${formatTimestamp(row.original.last_sync)}`}
          >
            {row.original.online ? (
              <>
                <div>
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
                </div>
                <div>
                  <FontAwesomeIcon icon={faBatteryThreeQuarters} />
                  {row.original.adjusted_battery_level}%
                </div>
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
                <div>
                  <FontAwesomeIcon icon={faBatteryThreeQuarters} />- %
                </div>
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // 모든 열에 적용될 사용자 정의 정렬 함수
  function customSort(rowA, rowB, columnId, desc) {
    // 하나라도 offline이면, offline인 행을 뒤로
    if (!rowA.original.online && rowB.original.online) {
      return 1; // A가 offline이면 B가 뒤로 갑니다.
    }
    if (rowA.original.online && !rowB.original.online) {
      return -1; // B가 offline이면 A가 뒤로 갑니다.
    }

    // 두 행 모두 online이면, 기존의 정렬 로직 적용
    if (rowA.original[columnId] > rowB.original[columnId]) {
      return desc ? -1 : 1;
    }
    if (rowA.original[columnId] < rowB.original[columnId]) {
      return desc ? 1 : -1;
    }

    // 값이 동일하거나 둘 다 offline인 경우, 원래 순서 유지
    return 0;
  }

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
        <span>작업자 상태</span>
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

function WorkerStatistic({ data }) {
  const levelCounts = data.reduce((acc, worker) => {
    const level = worker.work_level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(levelCounts).map((level) => ({
    name: `${level}단계`,
    y: levelCounts[level],
    color: getLevelColor(level), // 색상은 작업 단계에 따라 정의
  }));

  function getLevelColor(level) {
    switch (level) {
      case "1":
        return "rgb(34,180,237)";
      case "2":
        return "rgb(150,208,96)";
      case "3":
        return "rgb(255,252,75)";
      case "4":
        return "rgb(253,188,58)";
      case "5":
        return "rgb(250,0,25)";
      default:
        return "rgb(200,200,200)";
    }
  }

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent", // 배경을 투명하게 설정
      plotBorderWidth: null, // 테두리 제거
      plotShadow: false, // 그림자 제거
      // height: 250,
      width: 300,
      height: 300,
      plotBorderColor: "transparent",
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false, // 워터마크 제거
    },
    title: {
      text: null,
    },
    tooltip: {
      enabled: false,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        // allowPointSelect: true,
        // cursor: "pointer",
        dataLabels: {
          enabled: true,
          distance: -18,
          inside: true, // 데이터 라벨을 차트 안쪽에 표시
          format: "<b>{point.name}</b>",
          style: {
            color: "white",
            fontWeight: "light",
            fontFamily: "SUITE-Regular",
          },
        },
        innerSize: "70%", // 도넛 차트 두께 조절
      },
    },
    series: [
      {
        name: "Share",
        colorByPoint: true,
        data: chartData,
      },
    ],
  };

  return (
    <div className="worker-statistic layer2">
      <span className="bar"></span>
      <div className="header">
        <span>작업자 통계</span>
      </div>
      <div className="pie-chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="description">
        <span>1단계</span>
        <span>{levelCounts[1] || 0} 명</span>
      </div>
      <div className="description">
        <span>2단계</span>
        <span>{levelCounts[2] || 0} 명</span>
      </div>
      <div className="description">
        <span>3단계</span>
        <span>{levelCounts[3] || 0} 명</span>
      </div>
      <div className="description">
        <span>4단계</span>
        <span>{levelCounts[4] || 0} 명</span>
      </div>
      <div className="description">
        <span>5단계</span>
        <span>{levelCounts[5] || 0} 명</span>
      </div>
    </div>
  );
}

function Advice() {
  return (
    <div className="advice layer2">
      <span className="bar" />
      <div className="header">
        <span>권고사항</span>
      </div>
      <div className="advice-content">
        <div className="box">
          <span className="level">1단계(정상)</span>
          <span className="color lv1" />
          <span className="text">작업 지속</span>
        </div>
        <div className="box">
          <span className="level">2단계(정상)</span>
          <span className="color lv2" />
          <span className="text">환풍기 가동</span>
        </div>
        <div className="box">
          <span className="level">3단계(경고)</span>
          <span className="color lv3" />
          <span className="text">집진기 가동</span>
        </div>
        <div className="box">
          <span className="level">4단계(경고)</span>
          <span className="color lv4" />
          <span className="text">작업자 휴식</span>
        </div>
        <div className="box">
          <span className="level">5단계(위험)</span>
          <span className="color lv5" />
          <span className="text">작업정지</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
