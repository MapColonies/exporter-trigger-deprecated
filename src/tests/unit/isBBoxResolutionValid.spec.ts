import {isBBoxResolutionValid} from '../../util/isBBoxResolutionValid';

// Zoom level 15
const validExport = {
  zoomLevel: 15,
  bbox: [-122.456598, 37.735764, -122.455048, 37.737011],
};

const validNegativeValues = {
  zoomLevel: 15,
  bbox: [-122.456598, -37.737011, -122.455048, -37.735764],
};

// Zoom level 4
const invalidExport = {
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
      isBBoxResolutionValid(validExport.zoomLevel, validExport.bbox)
    ).toBeTruthy();
  });

  it('is valid negative export', () => {
    expect(
      isBBoxResolutionValid(
        validNegativeValues.zoomLevel,
        validNegativeValues.bbox
      )
    ).toBeTruthy();
  });

  it('is invalid export', () => {
    expect(
      isBBoxResolutionValid(invalidExport.zoomLevel, invalidExport.bbox)
    ).toBeFalsy();
  });
});
