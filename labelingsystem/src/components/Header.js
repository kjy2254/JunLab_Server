import styles from "./Header.module.css";

function Header({ authData, smallView, toggleSmallSidebar, toggleSidebar }) {
  return (
    <header className={`${styles.header} layerHeader`}>
      <div>
        <span className={`${styles.title}`}>
          [교량 외관망도 정보화] 라벨링 시스템
        </span>
        <button
          className={styles.toggle}
          onClick={() => {
            if (smallView) {
              toggleSmallSidebar();
            } else {
              toggleSidebar();
            }
          }}
        >
          ☰
        </button>
      </div>
      <span className={`${styles.userInfo}`}>
        {authData.user.name}님 환영합니다.
      </span>
      <button
        className={styles.logout}
        onClick={() =>
          (window.location.href = `http://junlab.postech.ac.kr:880/api/labeling/KICT/logout`)
        }
      >
        로그아웃
      </button>
    </header>
  );
}

export default Header;
