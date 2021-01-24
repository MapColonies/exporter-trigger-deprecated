import { Polygon } from '@turf/helpers';
import { IExportData, IInboundRequest } from '../model/exportRequest';
import { BadRequestError } from '../requests/errors/errors';
import { getPolygon } from './validateBboxArea';
import { get } from 'config';
import { IExportConfig } from '../model/exportConfig';

export default function (
  taskId: string,
  request: IInboundRequest
): IExportData {
  try {
    const exportConfig: IExportConfig = get('export');
    
    // Check if requested layer is exists
    if(!request.exportedLayers[0].sourceLayer) {
      request.exportedLayers[0].sourceLayer = exportConfig.defaultLayer;
      request.exportedLayers[0].url = exportConfig.defaultUrl;
    }

    const bbox = request.bbox;
    const polygon: Polygon = getPolygon(bbox);

    const exportData: IExportData = {
      taskId: taskId,
      directoryName: request.directoryName,
      fileName: request.fileName,
      sizeEst: request.sizeEst,
      maxZoom: request.maxZoom,
      polygon: polygon,
      exportedLayer: request.exportedLayers[0]
    };

    return exportData;
  } catch (error) {
    throw new BadRequestError(error);
  }
}
