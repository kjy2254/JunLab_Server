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
