import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import "../../css/Settings.css";

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
      .then(alert("저장이 완료되었습니다."))
      .then(() => fetchData())
      .catch((error) => {
        alert("API 요청 실패:", error);
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

export default AirWallSetting;
