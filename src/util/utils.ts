// TODO: Will be replaced by MC-UTILS
export const zoomLevelFromRes = (resolution: number): number => {
  const MIN_ZOOM_LEVEL = 0;
  const MAX_ZOOM_LEVEL = 22;
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const zoomLevel = Math.ceil(Math.log2(180 / (resolution * 256)));
  if (zoomLevel < MIN_ZOOM_LEVEL || zoomLevel > MAX_ZOOM_LEVEL)
    throw new Error(
      `Invalid zoom level ${zoomLevel} for resolution ${resolution}`
    );
  return zoomLevel;
};

export const DEFAULT_PRIORITY = 1000;
export const DEFAULT_CRS = 'EPSG:4326';
