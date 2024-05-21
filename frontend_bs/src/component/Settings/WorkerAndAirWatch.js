import axios from "axios";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import "../../css/Settings.css";
import default_watch from "../../image/default_watch.png";
import defaultProfile from "../../image/profile_default.png";
import { createFuzzyMatcher } from "../../util";

function WorkerAndAirWatch() {
  const { factoryId } = useParams();
  const [watches, setWatches] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [workerFilter, setWorkerFilter] = useState("");
  const [watchFilter, setWatchFilter] = useState("");

  const fetchData = () => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api2/settings/${factoryId}/watchlist`
      )
      .then((response) => {
        setWatches(response.data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/settings/${factoryId}/workers`)
      .then((response) => {
        setWorkers(response.data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    axios
      .put(
        `http://junlab.postech.ac.kr:880/api2/settings/${factoryId}/workers`,
        workers
      )
      .then(alert("저장이 완료되었습니다."))
      .then(() => fetchData())
      .catch((error) => {
        alert("API 요청 실패:", error);
      });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      console.log("Item was not dropped");
      return; // 아이템을 드롭하지 않은 경우
    }

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;
    const draggableId = result.draggableId;
    const watchId = draggableId.split("-")[1];

    // Watch list -> Watch list (현재 상태 유지)
    if (sourceId === "watches" && destinationId === "watches") {
      // 아무것도 하지 않음
    }
    // Watch list -> Worker card (선택된 watch를 선택된 worker와 페어링)
    else if (sourceId === "watches" && destinationId !== "watches") {
      const destinationWorkerId = parseInt(destinationId, 10);
      assignWatchToWorker(watchId, destinationWorkerId);
    }
    // Worker card -> Watch list (선택된 watch의 페어링 해제)
    else if (sourceId !== "watches" && destinationId === "watches") {
      unassignWatchFromWorker(watchId);
    }
    // Worker card -> Worker card (시작점과 도착점의 watch를 모두 페어링 해제 후 시작점의 watch를 도착점의 worker와 페어링)
    else if (sourceId !== "watches" && destinationId !== "watches") {
      const destinationWorkerId = parseInt(destinationId, 10);
      reassignWatch(watchId, destinationWorkerId);
    }
  };

  const assignWatchToWorker = (watchId, workerId) => {
    // 작업자의 페어링 업데이트
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => {
        if (worker.user_id === workerId) {
          return { ...worker, watch_id: watchId };
        }
        return worker;
      })
    );
  };

  const unassignWatchFromWorker = (watchId) => {
    // 작업자에서 시계 페어링 해제
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => {
        if (worker.watch_id === watchId) {
          return { ...worker, watch_id: null };
        }
        return worker;
      })
    );
  };

  const reassignWatch = (watchId, newWorkerId) => {
    // 기존 작업자에서 시계 페어링 해제
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => {
        if (worker.watch_id === watchId) {
          return { ...worker, watch_id: null };
        }
        return worker;
      })
    );

    // 새 작업자에게 시계 할당
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => {
        if (worker.user_id === newWorkerId) {
          return { ...worker, watch_id: watchId };
        }
        return worker;
      })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="worker-airwatch">
        <div className="left">
          <div className="top layer2">
            <input
              type="text"
              placeholder="Search Worker Name..."
              onChange={(e) => setWorkerFilter(e.target.value)}
            />
          </div>
          <div className="bottom">
            {workers
              .filter((v) =>
                createFuzzyMatcher(workerFilter).test(v.name.toLowerCase())
              )
              .map((worker) => (
                <div className="worker-card" key={worker.user_id}>
                  <div className="text">
                    <img src={defaultProfile} width={42} height={42} />
                    <div className="text-col">
                      <span>
                        {worker.name}({worker.gender})
                      </span>
                      <span className="role">{worker.role}</span>
                    </div>
                  </div>
                  <Droppable droppableId={`${worker.user_id}`} type="WATCH">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`watch-area ${
                          snapshot.isDraggingOver ? "dragging-over" : ""
                        }`}
                      >
                        {worker.watch_id ? (
                          <Draggable
                            key={worker.watch_id}
                            draggableId={`watch-${worker.watch_id}`}
                            index={0}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="watch"
                              >
                                <img
                                  src={default_watch}
                                  alt={`Watch ${worker.watch_id}`}
                                />
                                <span>Watch {worker.watch_id}</span>
                              </div>
                            )}
                          </Draggable>
                        ) : null}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
          </div>
        </div>
        <div className="right">
          <div className="top layer2">
            <input
              type="text"
              placeholder="Search Watch ID..."
              onChange={(e) => setWatchFilter(e.target.value)}
            />
          </div>
          <Droppable droppableId="watches" type="WATCH">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bottom"
              >
                {watches
                  .filter((v) =>
                    createFuzzyMatcher(watchFilter).test(v.watch_id)
                  )
                  .filter(
                    (watch) =>
                      !workers.some(
                        (worker) => worker.watch_id === watch.watch_id
                      )
                  )
                  .map((watch, index) => (
                    <Draggable
                      key={watch.watch_id}
                      draggableId={`watch-${watch.watch_id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="watch"
                        >
                          <img
                            src={default_watch}
                            alt={`Watch ${watch.watch_id}`}
                          />
                          <span>Watch {watch.watch_id}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </DragDropContext>
  );
}

export default WorkerAndAirWatch;
