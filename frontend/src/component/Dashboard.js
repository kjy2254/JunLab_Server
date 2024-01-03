import Sidebar from "./Sidebar";
import "../css/Dashboard.css";
import "../css/Theme.css";
import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ForbiddenPage from "./ForbiddenPage";
import Route from "./Route";
import Floorplan from "./Floorplan";
import Panel from "./Panel";

function Dashboard(props) {
  const [factoryName, setFactoryName] = useState();
  const [filter, setFilter] = useState("");
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [initialDataFetched, setInitialDataFetched] = useState(false);

  const { factoryId } = useParams();

  const fetchData = async () => {
    try {
      axios
        .get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}`)
        .then((response) => {
          setFactoryName(response.data.factoryName);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api/factory/dashboard/${factoryId}`
        )
        .then((response) => {
          setData(response.data);
          if (!initialDataFetched) {
            // 최초 데이터를 받아온 경우에만 페이지를 설정
            setInitialDataFetched(true);
          }
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  useEffect(() => {
    // 최초에만 실행되도록 처리
    if (!initialDataFetched) {
      fetchData();
    }

    // 페이지가 변경될 때마다 호출
    setPage(Object.keys(data)[0]);

    const interval = setInterval(() => {
      fetchData();
    }, 7000);

    // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌 정리
    return () => {
      clearInterval(interval);
    };
  }, [initialDataFetched]);

  if (
    !props.isLogin ||
    (props.role !== "Factory_" + factoryId && props.role !== "Admin")
  ) {
    return (
      <ForbiddenPage
        isLogin={props.isLogin}
        role={props.role}
        name={props.name}
      />
    );
  } else {
    return (
      <div className="dashboard-container ">
        <Sidebar header={factoryName} factoryId={factoryId} selected={"1"} />
        <div className="dashboard-content ">
          <div className="dashboard-main-section bg">
            <Header
              placeholder="Type any workers..."
              setData={setFilter}
              data={filter}
              isLogin={props.isLogin}
              role={props.role}
              name={props.name}
            />
            <div className="top-section">
              <Route
                routelist={["공장", factoryName]}
                finalroute={"통합상황판"}
              />
            </div>
            <div className="view-section bg2">
              <div className="view-left">
                <select
                  className="dropdown"
                  onChange={(e) => {
                    setPage(e.target.value);
                  }}
                >
                  {Object.keys(data).map((index) => (
                    <option key={index} value={index}>
                      {data[index].pageName}
                    </option>
                  ))}
                </select>
                <Floorplan data={data[page]} />
              </div>
              <div className="view-right bg5 ">
                <Panel />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
