// TODO: Will be replaced by MC-UTILS
export const zoomLevelFromRes = (resolution: number): number => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return Math.ceil(Math.log2(180 / (resolution * 256)));
}
