import { get } from 'config';
import { IBboxConfig } from '../model/bboxConfig';
import { BBox } from '@turf/helpers';
import bboxPolygon from '@turf/bbox-polygon';
import area from '@turf/area';

export default function validateBboxArea(bbox: number[]): boolean {
  const config: IBboxConfig = get('bbox');
  const limit = config.limit;

  // Spread 2d bbox and convert to turf type
  const convertedBbox: BBox = [bbox[0], bbox[1], bbox[2], bbox[3]];
  const polygon = bboxPolygon(convertedBbox);
  const polygonArea = area(polygon);

  return polygonArea <= limit;
}
