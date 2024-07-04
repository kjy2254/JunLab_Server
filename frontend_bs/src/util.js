import { escapeRegExp } from "lodash/string";
import { toast } from "react-toastify";

export function notify() {
  toast("이전 요청이 실행중입니다!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export function ch2pattern(ch) {
  const offset = 44032; /* '가'의 코드 */
  // 한국어 음절
  if (/[가-힣]/.test(ch)) {
    const chCode = ch.charCodeAt(0) - offset;
    // 종성이 있으면 문자 그대로를 찾는다.
    if (chCode % 28 > 0) {
      return ch;
    }
    const begin = Math.floor(chCode / 28) * 28 + offset;
    const end = begin + 27;
    return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }
  // 한글 자음
  if (/[ㄱ-ㅎ]/.test(ch)) {
    const con2syl = {
      ㄱ: "가".charCodeAt(0),
      ㄲ: "까".charCodeAt(0),
      ㄴ: "나".charCodeAt(0),
      ㄷ: "다".charCodeAt(0),
      ㄸ: "따".charCodeAt(0),
      ㄹ: "라".charCodeAt(0),
      ㅁ: "마".charCodeAt(0),
      ㅂ: "바".charCodeAt(0),
      ㅃ: "빠".charCodeAt(0),
      ㅅ: "사".charCodeAt(0),
    };
    const begin =
      con2syl[ch] ||
      (ch.charCodeAt(0) - 12613) /* 'ㅅ'의 코드 */ * 588 + con2syl["ㅅ"];
    const end = begin + 587;
    return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }

  return escapeRegExp(ch);
}

export function createFuzzyMatcher(input) {
  const pattern = input.toLowerCase().split("").map(ch2pattern).join(".*?");
  return new RegExp(pattern);
}

export async function authcheck() {
  const response = await fetch(
    "http://junlab.postech.ac.kr:880/login/authcheck2"
  );
  const data = await response.json();
  return {
    isLogin: data.isLogin,
    name: data.name,
    userId: data.userId,
    authority: data.authority,
    manageOf: data.manageOf,
  };
}

export function initHorizontalScroll() {
  document.querySelectorAll(".js-horizontal-scroll").forEach((el) => {
    el.addEventListener("wheel", (e) => {
      // 스크롤이 왼쪽 또는 오른쪽 끝에 도달했는지 확인
      const atLeftEnd = el.scrollLeft === 0;
      const atRightEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth;

      // 휠 이벤트가 위로 가는 것인지 아래로 가는 것인지 확인
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      if ((atLeftEnd && scrollingUp) || (atRightEnd && scrollingDown)) {
        // 스크롤이 양 끝에 있고 사용자가 해당 방향으로 계속 스크롤하려고 하면,
        // 이벤트의 기본 동작을 수행하여 수직 스크론을 허용합니다.
        return;
      }

      // 그렇지 않으면, 가로 스크롤을 진행합니다.
      e.preventDefault();
      // noinspection JSSuspiciousNameCombination
      el.scrollLeft += e.deltaY;
    });
  });
}

export function setLightTheme() {
  document.documentElement.style.setProperty(
    "--layer1-bg-color",
    "rgb(244, 246, 249)"
  );
  document.documentElement.style.setProperty(
    "--layer2-bg-color",
    "rgb(255, 255, 255)"
  );
  document.documentElement.style.setProperty(
    "--layer2-gradient1-color",
    "rgba(255, 255, 255, 0)"
  );
  document.documentElement.style.setProperty(
    "--layer2-gradient2-color",
    "rgba(255, 255, 255, 0.75)"
  );
  document.documentElement.style.setProperty(
    "--layer2-gradient3-color",
    "rgba(255, 255, 255, 1)"
  );
  document.documentElement.style.setProperty(
    "--layerSB-bg-color",
    "rgb(36, 42, 51)"
  );
  document.documentElement.style.setProperty(
    "--layerHD-bg-color",
    "rgb(255, 255, 255)"
  );
  document.documentElement.style.setProperty(
    "--layerModal-bg-color",
    "rgb(244, 246, 249)"
  );
  document.documentElement.style.setProperty(
    "--border-color",
    "rgb(228, 231, 234)"
  );
  document.documentElement.style.setProperty("--select-color", "#ececec");
  document.documentElement.style.setProperty(
    "--text-color",
    "rgb(103, 117, 124)"
  );
  document.documentElement.style.setProperty(
    "--spinner-color",
    "rgb(228, 231, 234)"
  );
  document.documentElement.style.setProperty("--spinner-top-color", "gray");
  document.documentElement.style.setProperty("--graph-label-color", "black");
  document.documentElement.style.setProperty("--drag-over-color", "#555");
  document.documentElement.style.setProperty("--dot-color", "black");

  document.documentElement.style.setProperty("--radar-red", "#ff9a9a");
  document.documentElement.style.setProperty("--radar-yellow", "#f8f88a");
  document.documentElement.style.setProperty("--radar-green", "#a2ffa2");
}

export function setDarkTheme() {
  document.documentElement.style.setProperty(
    "--layer1-bg-color",
    "rgb(48, 58, 69)"
  );
  document.documentElement.style.setProperty(
    "--layer2-bg-color",
    "rgb(25, 36, 48)"
  );

  document.documentElement.style.setProperty(
    "--layer2-gradient1-color",
    "rgba(25, 36, 48, 0)"
  );
  document.documentElement.style.setProperty(
    "--layer2-gradient2-color",
    "rgba(25, 36, 48, 0.75)"
  );
  document.documentElement.style.setProperty(
    "--layer2-gradient3-color",
    "rgba(25, 36, 48, 1)"
  );

  document.documentElement.style.setProperty(
    "--layerSB-bg-color",
    "rgb(25, 36, 48)"
  );
  document.documentElement.style.setProperty(
    "--layerHD-bg-color",
    "rgb(25, 36, 48)"
  );
  document.documentElement.style.setProperty(
    "--layerModal-bg-color",
    "rgb(48, 58, 69)"
  );
  document.documentElement.style.setProperty(
    "--border-color",
    "rgba(255, 255, 255, 0.2)"
  );
  document.documentElement.style.setProperty("--select-color", "#303a45");
  document.documentElement.style.setProperty(
    "--text-color",
    "rgb(230, 233, 236)"
  );
  document.documentElement.style.setProperty(
    "--spinner-color",
    "rgba(255, 255, 255, 0.3)"
  );
  document.documentElement.style.setProperty("--spinner-top-color", "white");
  document.documentElement.style.setProperty(
    "--graph-label-color",
    "rgb(230, 233, 236)"
  );
  document.documentElement.style.setProperty("--drag-over-color", "#ccc");
  document.documentElement.style.setProperty("--dot-color", "white");

  document.documentElement.style.setProperty("--radar-red", "#d65959");
  document.documentElement.style.setProperty("--radar-yellow", "#e0e050");
  document.documentElement.style.setProperty("--radar-green", "#50eb50");
}
