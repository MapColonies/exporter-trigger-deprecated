import { Polygon } from '@turf/helpers';
import { IExportData, IInboundRequest } from '../model/exportRequest';
import { BadRequestError } from '../requests/errors/errors';
import { getPolygon } from './validateBboxArea';

export default function (
  taskId: string,
  request: IInboundRequest
): IExportData {
  try {
    const bbox = request.bbox;
    const polygon: Polygon = getPolygon(bbox);

    const exportData: IExportData = {
      taskId: taskId,
      fileName: request.fileName,
      sizeEst: request.sizeEst,
      tilesEst: request.tilesEst,
      polygon: polygon,
      directoryName: 'TEST_DIR',
    };

    return exportData;
  } catch (error) {
    throw new BadRequestError(error);
  }
}
