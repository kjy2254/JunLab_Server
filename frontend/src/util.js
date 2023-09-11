import {escapeRegExp} from "lodash/string";

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
            'ㄱ': '가'.charCodeAt(0),
            'ㄲ': '까'.charCodeAt(0),
            'ㄴ': '나'.charCodeAt(0),
            'ㄷ': '다'.charCodeAt(0),
            'ㄸ': '따'.charCodeAt(0),
            'ㄹ': '라'.charCodeAt(0),
            'ㅁ': '마'.charCodeAt(0),
            'ㅂ': '바'.charCodeAt(0),
            'ㅃ': '빠'.charCodeAt(0),
            'ㅅ': '사'.charCodeAt(0),
        };
        const begin = con2syl[ch] || ((ch.charCodeAt(0) - 12613 /* 'ㅅ'의 코드 */) * 588 + con2syl['ㅅ']);
        const end = begin + 587;
        return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
    }

    return escapeRegExp(ch);
}

export function createFuzzyMatcher(input) {
    const pattern = input.toLowerCase().split('').map(ch2pattern).join('.*?');
    return new RegExp(pattern);
}

export function calculateGradientColors(startColor) {
    hexToRgb(startColor);
    const transparentColor = 'rgba(255, 255, 255, 0)';
    return [
        [0, startColor],         // 시작 색상
        [1, transparentColor]    // 투명한 색상
    ];
}

export function hexToRgb(hex) {
    // #을 제거하고 16진수를 10진수로 변환
    const bigint = parseInt(hex.slice(1), 16);

    // 10진수를 RGB 채널로 분할
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}