import "../../css/Labeling.css";
import axios from "axios";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faVenus,
  faMars,
} from "@fortawesome/free-solid-svg-icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Labeling() {
  const [lightMode, setLightMode] = useState(
    localStorage.getItem("lightMode") === "true"
  );

  const toggleTheme = () => {
    const newLightMode = !lightMode;
    setLightMode(newLightMode);
    localStorage.setItem("lightMode", newLightMode ? "true" : "false");
    document.body.classList.toggle("light-mode", newLightMode);
  };

  const [data, setData] = useState({});
  const [tvoc, setTVOC] = useState({});
  const [co2, setCO2] = useState({});
  const [heartrate, setHeartrate] = useState({});
  const [oxygen, setOxygen] = useState({});
  const [envbox, setEnvbox] = useState(false);
  const [healthbox, setHealthbox] = useState(false);

  const [authData, setAuthData] = useState({});
  const [score, setScore] = useState(0);
  const [id, setId] = useState();
  const [progressData, setProgressData] = useState({});

  const defaultOptions = {
    time: {
      timezone: "Asia/Seoul",
    },
    chart: {
      backgroundColor: "transparent", // 배경을 투명하게 설정
      plotBorderColor: "transparent",
    },
    title: {
      // text: "총휘발성유기화합물",
      margin: 30,
      align: "left",
      style: {
        color: lightMode ? "inherit" : "rgb(230, 233, 236)",
      },
    },
    yAxis: {
      title: {
        enabled: false,
      },
      labels: {
        style: {
          color: lightMode ? "inherit" : "rgb(230, 233, 236)",
        },
      },
      gridLineColor: lightMode
        ? "var(--border-color-light)"
        : "var(--border-color-dark)",
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: lightMode ? "inherit" : "rgb(230, 233, 236)",
        },
        // formatter: function () {
        //   return Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.value); // 원하는 날짜 포맷으로 설정
        // },
      },
      plotLines: [
        {
          color: "#FF0000", // 빨간색
          width: 2, // 선의 너비
          value: 2020, // 마지막 데이터 포인트의 X 위치 값
        },
      ],
      lineColor: lightMode ? "black" : "rgb(230, 233, 236)",
      tickColor: lightMode ? "black" : "rgb(230, 233, 236)",
    },
    credits: {
      enabled: false, // 워터마크 제거
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    },
  };

  const fetchData = (fetchId) => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api3/label/data/${fetchId}?type=${authData.type}`
      )
      .then((response) => {
        const {
          co2,
          tvoc,
          timestamp,
          heart_rate,
          oxygen_saturation,
          workerId,
          fakeName,
          age,
          gender,
          height,
          weight,
          illness,
          job,
          smoke,
          numOfDrink,
          employmentPeriod,
          id,
          env_y,
          health_y,
        } = response.data;

        if (authData.type == "health") {
          setScore(health_y);
        } else if (authData.type == "env") {
          setScore(env_y);
        }

        if (!fetchId) {
          setScore(0);
        }

        // 시간 데이터를 기반으로 차트 데이터 생성
        const chartData = Object.keys(timestamp).map((key, index) => ({
          x: new Date(timestamp[key]).getTime(),
          co2: co2[key],
          tvoc: tvoc[key],
          heart_rate: heart_rate[key],
          oxygen_saturation: oxygen_saturation[key],
        }));

        // 차트 데이터로부터 각각의 시리즈 데이터 생성
        const tvocSeriesData = chartData.map((data) => ({
          x: data.x,
          y: data.tvoc,
        }));
        const co2SeriesData = chartData.map((data) => ({
          x: data.x,
          y: data.co2,
        }));
        const heartRateSeriesData = chartData.map((data) => ({
          x: data.x,
          y: data.heart_rate,
        }));
        const oxygenSaturationSeriesData = chartData.map((data) => ({
          x: data.x,
          y: data.oxygen_saturation,
        }));

        // 각 차트의 옵션 설정 및 업데이트
        setTVOC({
          ...defaultOptions,
          title: { ...defaultOptions.title, text: "총휘발성유기화합물(ppm)" },
          series: [{ name: "TVOC", data: tvocSeriesData, color: "#2ca02c" }],
        });

        setCO2({
          ...defaultOptions,
          title: { ...defaultOptions.title, text: "이산화탄소(ppm)" },
          series: [{ name: "CO2", data: co2SeriesData, color: "#ff7f0e" }],
        });

        setHeartrate({
          ...defaultOptions,
          title: { ...defaultOptions.title, text: "심박수(bpm)" },
          series: [
            { name: "Heart Rate", data: heartRateSeriesData, color: "#d62728" },
          ],
        });

        setOxygen({
          ...defaultOptions,
          title: { ...defaultOptions.title, text: "산소포화도(%)" },
          series: [
            {
              name: "Oxygen Saturation",
              data: oxygenSaturationSeriesData,
              color: "#1f77b4",
            },
          ],
        });

        // 추가 정보 업데이트
        setData({
          workerId,
          fakeName,
          age,
          gender,
          height,
          weight,
          illness,
          job,
          smoke,
          numOfDrink,
          employmentPeriod,
        });

        setId(id); // ID 업데이트
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  const fetchProgress = () => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api3/label/progress?id=${authData.id}&type=${authData.type}`
      )
      .then((response) => {
        setProgressData(response.data);
      });
  };

  useEffect(() => {
    const labeler = prompt("코드를 입력하세요.");
    axios
      .post("http://junlab.postech.ac.kr:880/login/label-login", {
        labelerId: labeler,
      })
      .then((response) => {
        const data = response.data;
        if (!data.isLogin) {
          alert("코드가 잘못되었습니다.");
        } else {
          alert("확인되었습니다.");
          setAuthData(data);
          setEnvbox(data.type == "env");
          setHealthbox(data.type == "health");
        }
      });
  }, []);

  useEffect(() => {
    if (authData.id && authData.type) {
      fetchProgress();
    }
  }, [authData, id]);

  useEffect(() => {
    if (authData.id && authData.type) {
      fetchData();
    }
  }, [authData]);

  useEffect(() => {
    const updateGraphOptions = (currentOptions, newTitleText) => {
      return {
        ...currentOptions,
        chart: { ...defaultOptions.chart },
        title: {
          ...currentOptions.title,
          text: newTitleText || currentOptions.title.text,
          style: { color: lightMode ? "inherit" : "rgb(230, 233, 236)" },
        },
        yAxis: {
          ...defaultOptions.yAxis,
          labels: {
            style: { color: lightMode ? "inherit" : "rgb(230, 233, 236)" },
          },
        },
        xAxis: {
          ...defaultOptions.xAxis,
          labels: {
            style: { color: lightMode ? "inherit" : "rgb(230, 233, 236)" },
          },
        },
        legend: { ...defaultOptions.legend },
        credits: { ...defaultOptions.credits },
        plotOptions: { ...defaultOptions.plotOptions },
      };
    };

    setTVOC((prevOptions) => updateGraphOptions(prevOptions, "TVOC 농도"));
    setCO2((prevOptions) => updateGraphOptions(prevOptions, "이산화탄소(ppm)"));
    setHeartrate((prevOptions) =>
      updateGraphOptions(prevOptions, "심박수(bpm)")
    );
    setOxygen((prevOptions) =>
      updateGraphOptions(prevOptions, "산소포화도(%)")
    );
  }, [lightMode]);

  const putData = () => {
    if (score == 0) {
      alert("점수는 1~100점 범위입니다.");
      return;
    }
    axios
      .put(`http://junlab.postech.ac.kr:880/api3/label/${authData.type}`, {
        id: id,
        score: score,
        labeler: authData.id,
      })
      .then(() => {
        fetchData();
      });
  };

  const handleEnterPress = (event) => {
    // 엔터 키의 keyCode는 13입니다.
    if (event.keyCode === 13) {
      putData();
    }
  };

  return (
    <>
      <Navbar className="custom-navbar layerHD" expand={true}>
        <Navbar.Brand className="logo layerHD">Logo</Navbar.Brand>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="d-flex justify-content-between"
        >
          <div className="route">
            <span className="header-text">라벨링</span>
          </div>
          <Nav className="buttons">
            <div className="theme-toggle-button" onClick={toggleTheme}>
              <div className={`toggle-switch ${lightMode ? "" : "active"}`}>
                <FontAwesomeIcon icon={faMoon} className="icon moon-icon" />
                <FontAwesomeIcon icon={faSun} className="icon sun-icon" />
                <div className="toggle-handle"></div>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {authData.isLogin ? (
        <div className="labeling">
          <div className="labeling-wrapper layer2">
            <div className="personal-info">
              <div className="header">
                <span>
                  <FontAwesomeIcon
                    icon={data.gender == "male" ? faMars : faVenus}
                    className={data.gender == "male" ? "male" : "female"}
                    title={data.gender == "male" ? "남성" : "여성"}
                  />
                  {data.fakeName}({data.age}대)
                </span>
                <div className="data-type">
                  <div>
                    <input
                      type="checkbox"
                      value={envbox}
                      checked={envbox}
                      onChange={() => setEnvbox(!envbox)}
                      disabled={authData.type == "env"}
                    />
                    <span>&nbsp; Enviroment Data</span>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value={healthbox}
                      checked={healthbox}
                      onChange={() => setHealthbox(!healthbox)}
                      disabled={authData.type == "health"}
                    />
                    <span>&nbsp; Health Data</span>
                  </div>
                </div>
              </div>
              <div className="meta-area">
                <div className="meta-info">
                  <span>
                    키: {data.height}cm, &nbsp; 몸무게: {data.weight}kg
                  </span>
                  <span>직무: {data.job} </span>
                  <span>근속년수: {data.employmentPeriod}년</span>
                </div>
                <div className="meta-info">
                  <span>흡연: {data.smoke ? data.smoke + "개비/일" : "X"}</span>
                  <span>
                    음주: {data.numOfDrink ? data.numOfDrink + "병/주" : "X"}
                  </span>
                </div>
              </div>
            </div>
            <div className="graph-area">
              {envbox ? (
                <>
                  <div className="graph">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={tvoc} // tvoc에 대한 options 사용
                      containerProps={{
                        style: {
                          width: "100%",
                          height: "100%",
                          padding: "1rem",
                        },
                      }}
                    />
                  </div>
                  <div className="graph">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={co2} // co2에 대한 options 사용
                      containerProps={{
                        style: {
                          width: "100%",
                          height: "100%",
                          padding: "1rem",
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              {healthbox ? (
                <>
                  <div className="graph">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={heartrate} // tvoc에 대한 options 사용
                      containerProps={{
                        style: {
                          width: "100%",
                          height: "100%",
                          padding: "1rem",
                        },
                      }}
                    />
                  </div>
                  <div className="graph">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={oxygen} // co2에 대한 options 사용
                      containerProps={{
                        style: {
                          width: "100%",
                          height: "100%",
                          padding: "1rem",
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="bottom">
              <span>진행률({progressData.length}/200)</span>
              <div className="right">
                <div className="score">
                  <span title="0에 가까울 수록 좋음">점수:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);
                      setScore(isNaN(newValue) ? 0 : newValue);
                    }}
                    onBlur={() => {
                      setScore((prev) => Math.min(Math.max(prev, 0), 100));
                    }}
                    onKeyDown={handleEnterPress}
                  />{" "}
                </div>
                <div className="buttons">
                  <button onClick={() => fetchData()}>스킵</button>
                  <button onClick={putData}>다음</button>
                </div>
              </div>
            </div>
          </div>
          <div className="progress-data layer2">
            {progressData.labeled?.map((e) => (
              <div
                key={e.id}
                className="progress-card"
                onClick={() => {
                  fetchData(e.id);
                }}
              >
                <span>점수: {e.y}</span>
                <span>{new Date(e.label_time).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>코드가 잘못되었습니다. 새로고침하여 재입력 해주세요.</div>
      )}
    </>
  );
}

export default Labeling;
