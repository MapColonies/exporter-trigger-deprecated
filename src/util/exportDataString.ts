import { Polygon } from '@turf/helpers';
import { get } from 'config';
import { IExportData, IInboundRequest, ILayerData } from '../model/exportRequest';
import { BadRequestError } from '../requests/errors/errors';
import { IExportConfig } from '../model/exportConfig';
import { getPolygon } from './validateBboxArea';

export default function (
  taskId: string,
  request: IInboundRequest
): IExportData {
  try {
    const exportConfig: IExportConfig = get('export');
    
    // Check if requested layer is exists
    /* eslint-disable */
    if(!(request.exportedLayers && request.exportedLayers[0] && request.exportedLayers[0].sourceLayer)) {
      const exportLayer: ILayerData = {
        url: exportConfig.defaultUrl,
        sourceLayer: exportConfig.defaultLayer,
        exportType: exportConfig.defaultType
      }

      request.exportedLayers = [] as ILayerData[];
      request.exportedLayers.push(exportLayer);
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
