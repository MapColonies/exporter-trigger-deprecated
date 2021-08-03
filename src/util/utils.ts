export const zoomLevelFromRes = (resolution: number): number => {
    return Math.floor(Math.log2(180 / (resolution * 256)));
}