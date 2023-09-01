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