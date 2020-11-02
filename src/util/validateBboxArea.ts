import { get } from 'config';
import { BBox } from '@turf/helpers';
import bboxPolygon from '@turf/bbox-polygon';
import area from '@turf/area';
import { IBboxConfig } from '../model/bboxConfig';
import {
  BboxValidationError,
  BboxAreaValidationError,
} from '../requests/errors/export';

export default function validateBboxArea(bbox: number[]): void {
  const config: IBboxConfig = get('bbox');
  const limit = config.limit;
  let polygonArea;

  // Spread 2d bbox and convert to turf type
  const convertedBbox: BBox = [bbox[0], bbox[1], bbox[2], bbox[3]];

  try {
    // Calculate bbox area
    const polygon = bboxPolygon(convertedBbox);
    polygonArea = area(polygon);
  } catch (error) {
    throw new BboxValidationError(error, bbox);
  }

  if (polygonArea > limit) {
    throw new BboxAreaValidationError(bbox);
  }
}
