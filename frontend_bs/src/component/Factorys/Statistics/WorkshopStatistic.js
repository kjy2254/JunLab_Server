import React from "react";
import styles from "./Statistic.module.css";

function WorkshopStatistic() {
  return (
    <div className={`${styles["workshop-statistic"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <span>작업장 통계</span>
      </div>
      <hr />
      <div className={styles.body}>
        <div className={`${styles.card} ${styles.level2}`}>
          <div className={styles.title}>작업장 A-1</div>
          <hr />
          <div className={styles.text}>
            <div className={styles.aq}>
              <span className={styles.head}>&gt; 공기질 지수</span>
              <span>0.6</span>
            </div>
            <hr className="vertical" />
            <div className={styles.worker}>
              <span className={styles.head}>&gt; 작업자</span>
              <span>4명</span>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.level4}`}>
          <div className={styles.title}>작업장 A-2</div>
          <hr />
          <div className={styles.text}>
            <div className={styles.aq}>
              <span className={styles.head}>&gt; 공기질 지수</span>
              <span>1.7</span>
            </div>
            <hr className="vertical" />
            <div className={styles.worker}>
              <span className={styles.head}>&gt; 작업자</span>
              <span>2명</span>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.level1}`}>
          <div className={styles.title}>작업장 B-1</div>
          <hr />
          <div className={styles.text}>
            <div className={styles.aq}>
              <span className={styles.head}>&gt; 공기질 지수</span>
              <span>0.3</span>
            </div>
            <hr className="vertical" />
            <div className={styles.worker}>
              <span className={styles.head}>&gt; 작업자</span>
              <span>5명</span>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.level3}`}>
          <div className={styles.title}>작업장 B-2</div>
          <hr />
          <div className={styles.text}>
            <div className={styles.aq}>
              <span className={styles.head}>&gt; 공기질 지수</span>
              <span>1.1</span>
            </div>
            <hr className="vertical" />
            <div className={styles.worker}>
              <span className={styles.head}>&gt; 작업자</span>
              <span>7명</span>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.level3}`}>
          <div className={styles.title}>작업장 C-1</div>
          <hr />
          <div className={styles.text}>
            <div className={styles.aq}>
              <span className={styles.head}>&gt; 공기질 지수</span>
              <span>0.8</span>
            </div>
            <hr className="vertical" />
            <div className={styles.worker}>
              <span className={styles.head}>&gt; 작업자</span>
              <span>3명</span>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.level5}`}>
          <div className={styles.title}>작업장 C-2</div>
          <hr />
          <div className={styles.text}>
            <div className={styles.aq}>
              <span className={styles.head}>&gt; 공기질 지수</span>
              <span>2.3</span>
            </div>
            <hr className="vertical" />
            <div className={styles.worker}>
              <span className={styles.head}>&gt; 작업자</span>
              <span>6명</span>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.level5}`}>
          <div className={styles.title}>작업장 C-2</div>
          <hr />
          <div className={styles.text}>
            <div className={styles.aq}>
              <span className={styles.head}>&gt; 공기질 지수</span>
              <span>2.3</span>
            </div>
            <hr className="vertical" />
            <div className={styles.worker}>
              <span className={styles.head}>&gt; 작업자</span>
              <span>6명</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkshopStatistic;
