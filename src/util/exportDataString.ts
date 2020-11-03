import { IExportData, IInboundRequest } from '../model/exportRequest';
import { BadRequestError } from '../requests/errors/errors';
import { Polygon } from '@turf/helpers';
import { getPolygon, validateBboxArea } from './validateBboxArea';

export default function (
  taskId: string,
  request: IInboundRequest
): IExportData {
  try {
    const bbox = request.bbox;
    const polygon: Polygon = getPolygon(bbox);
    // Validate bbox
    validateBboxArea(polygon, bbox);

    const exportData: IExportData = {
      taskId: taskId,
      fileName: request.fileName,
      sizeEst: request.sizeEst,
      tilesEst: request.tilesEst,
      polygon: polygon,
      directoryName: ''
    };

    return exportData;
  } catch (error) {
    throw new BadRequestError(error);
  }
}
