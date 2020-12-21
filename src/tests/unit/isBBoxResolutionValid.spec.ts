import isBBoxResolutionValid from '../../util/isBBoxResolutionValid';

// Zoom level 15
const valid_export = {
  zoomLevel: 15,
  bbox: [-122.456598, 37.735764, -122.455048, 37.737011],
};

const valid_negative_values = {
  zoomLevel: 15,
  bbox: [-122.456598, -37.737011, -122.455048, -37.735764],
};

// Zoom level 4
const invalid_export = {
  zoomLevel: 4,
  bbox: [
    35.34901384644131,
    33.0377182656489,
    35.34915987312472,
    33.037930668097495,
  ],
};

describe('BBox resolution test', () => {
  it('is valid export', () => {
    expect(
      isBBoxResolutionValid(valid_export.zoomLevel, valid_export.bbox)
    ).toBeTruthy();
  });

  it('is valid negative export', () => {
    expect(
      isBBoxResolutionValid(
        valid_negative_values.zoomLevel,
        valid_negative_values.bbox
      )
    ).toBeTruthy();
  });

  it('is invalid export', () => {
    expect(
      isBBoxResolutionValid(invalid_export.zoomLevel, invalid_export.bbox)
    ).toBeFalsy();
  });
});
