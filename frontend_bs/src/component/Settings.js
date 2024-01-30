import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faE, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../css/Settings.css";
import axios from "axios";
import default_watch from "../image/default_watch.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Settings(props) {
  props.setHeaderText("설정");

  return (
    <div className="settings">
      <div className="settings-wrapper layer2">
        <Tabs>
          <TabList>
            <Tab>고정식 센서</Tab>
            <Tab>작업자</Tab>
          </TabList>
          <TabPanel>
            <AirWallSetting />
          </TabPanel>
          <TabPanel>
            <WorkerAndAirWatch />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

function AirWallSetting() {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { factoryId } = useParams();

  const fetchData = () => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api2/settings/${factoryId}/airwalls`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
    setEditMode(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleEnable = (moduleId) => {
    setData(
      data.map((item) => {
        if (item.module_id === moduleId) {
          return { ...item, enable: !item.enable };
        }
        return item;
      })
    );
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleInputChange = (moduleId, field, value) => {
    setData(
      data.map((item) => {
        if (item.module_id === moduleId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    axios
      .put(
        `http://junlab.postech.ac.kr:880/api2/settings/${factoryId}/airwalls`,
        data
      )
      .then(() => fetchData())
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  return (
    <div className="airwall-setting">
      <table>
        <thead>
          <tr>
            <th width={100}>ID</th>
            <th width={100}>이름</th>
            <th>설명</th>
            <th width={80}>활성화</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => (
            <tr key={e.module_id}>
              <td>{e.module_id}</td>
              <td>
                {editMode ? (
                  <input
                    type="text"
                    value={e.module_name}
                    onChange={(event) =>
                      handleInputChange(
                        e.module_id,
                        "module_name",
                        event.target.value
                      )
                    }
                  />
                ) : (
                  <>{e.module_name}</>
                )}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="text"
                    value={e.module_description}
                    onChange={(event) =>
                      handleInputChange(
                        e.module_id,
                        "module_description",
                        event.target.value
                      )
                    }
                  />
                ) : (
                  <>{e.module_description}</>
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={e.enable}
                  onChange={() => toggleEnable(e.module_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons">
        <button className="edit" onClick={toggleEditMode}>
          수정
        </button>
        &nbsp;
        <button className="save" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
}

function WorkerAndAirWatch() {
  const [watches, setWatches] = useState([
    { id: 1001 },
    { id: 1002 },
    { id: 1003 },
    { id: 1003 },
    { id: 1003 },
    { id: 1003 },
    { id: 1003 },
  ]);

  const [workers, setWorkers] = useState([
    { id: 2001 },
    { id: 2002 },
    { id: 2003 },
    { id: 2003 },
    { id: 2003 },
    { id: 2003 },
    { id: 2003 },
  ]);

  return (
    <div className="worker-airwatch">
      <div className="left">
        <div className="top">
          <input type="text" placeholder="Search Worker Name..." />
        </div>
        <div className="bottom">
          {workers.map((e) => (
            <div className="worker-card">
              <span>{e.id}</span>
              <div className="watch"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <div className="top">
          <input type="text" placeholder="Search Watch ID..." />
        </div>
        <div className="bottom">
          {watches.map((e) => (
            <div className="watch">
              <img src={default_watch} />
              <span>Watch {e.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
