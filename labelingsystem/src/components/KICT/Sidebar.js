import axios from "axios";
import styles from "./Sidebar.module.css";

function Sidebar({ originList, userId, setIsLoaded, currentOriginId }) {
  const handleClickList = (originId) => {
    console.log(currentOriginId, originId);
    if (currentOriginId != originId) {
      axios
        .put(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/progress?userId=${userId}&originId=${originId}`
        )
        .then((response) => {
          setIsLoaded(false);
        });
    }
  };

  return (
    <aside className={`${styles.sidebar} layerSidebar`}>
      <ul>
        {originList?.map((e) => (
          <li key={e.origin_id} onClick={() => handleClickList(e.origin_id)}>
            <span>ID: {e.origin_id}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>FILE: {e.file_name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
