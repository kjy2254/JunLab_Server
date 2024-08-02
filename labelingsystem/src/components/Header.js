import styles from "./Header.module.css";

function Header() {
  return (
    <header className={`${styles.header} layerHeader`}>
      <span>[KICT 교량 외관망도 정보화] 라벨링 시스템</span>
    </header>
  );
}

export default Header;
