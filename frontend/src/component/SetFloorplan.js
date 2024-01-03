import React, { useState, useEffect } from "react";
import "../css/SetFloorplan.css";
import axios from "axios";
import AddPageModal from "./AddPageModal";
import DraggableComponent from "./DraggableComponent";

function SetFloorplan(props) {
  const [setting, setSetting] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState({});
  const [image, setImage] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [workers, setWorkers] = useState({});
  const [modules, setModules] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://junlab.postech.ac.kr:880/api/floorset/${props.factoryId}`
      );
      setSetting(response.data);
      setPage(response.data.floorplans[0]);
      setImage(
        `http://junlab.postech.ac.kr:880/api/image/${response.data.floorplans[0].imageName}`
      );
      setDimensions({
        width: response.data.floorplans[0].width,
        height: response.data.floorplans[0].height,
      });
      setWorkers(response.data.floorplans[0].workers);
      setModules(response.data.floorplans[0].modules);
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  const handleSave = async () => {
    try {
      // PUT 요청을 보낼 데이터 준비
      const requestData = {
        factoryId: props.factoryId,
        page: page.page,
        workers: workers,
        modules: modules,
      };

      // API 엔드포인트에 PUT 요청 보내기
      await axios.put(
        "http://junlab.postech.ac.kr:880/api/updatepage",
        requestData
      );

      alert("데이터 업데이트 성공");
    } catch (error) {
      console.error("데이터 업데이트 실패:", error);
    }
  };

  const handleImageDelete = async (page) => {
    try {
      // 이미지 삭제 API 호출
      await axios.delete(`http://junlab.postech.ac.kr:880/api/deletepage`, {
        data: {
          factoryId: props.factoryId,
          page: page,
        },
      });

      // 이미지 삭제 후 데이터 다시 가져오기
      fetchData();
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isModalOpen, props.factoryId]);

  return (
    <div className="set-floor-wrapper">
      <select
        className="dropdown"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          const selectedPage = selectedOption.value;

          const selectedFloorplan = setting.floorplans.find(
            (floorplan) => floorplan.imageName === selectedPage
          );

          setPage(selectedFloorplan);
          setImage(
            `http://junlab.postech.ac.kr:880/api/image/${selectedFloorplan.imageName}`
          );
          setDimensions({
            width: selectedFloorplan.width,
            height: selectedFloorplan.height,
          });
          setWorkers(selectedFloorplan.workers);
          setModules(selectedFloorplan.modules);
        }}
      >
        {setting.floorplans?.map((e) => (
          <option
            key={e.page}
            value={e.imageName}
            dimension={JSON.stringify({ width: e.width, height: e.height })}
          >
            {e.schemeName}
          </option>
        ))}
      </select>

      <div
        className="floor-plan"
        style={{
          backgroundImage: `url(${image})`,
          aspectRatio: `${dimensions.width / dimensions.height}`,
        }}
      >
        {page?.workers?.map((e) => (
          <DraggableComponent
            key={e.id}
            id={e.id}
            name={e.name}
            x={e.x}
            y={e.y}
            workers={workers}
            setWorkers={setWorkers}
            type={"worker"}
          />
        ))}
        {page?.modules?.map((e) => (
          <DraggableComponent
            key={e.id}
            id={e.id}
            name={e.name}
            x={e.x}
            y={e.y}
            modules={modules}
            setModules={setModules}
            type={"module"}
          />
        ))}
      </div>

      <button
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Add Page
      </button>
      <AddPageModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        factoryId={props.factoryId}
      />

      <button onClick={handleSave}>save</button>
    </div>
  );
}

export default SetFloorplan;
