import { IExportData, IInboundRequest } from '../model/exportRequest';
import { BadRequestError } from '../requests/errors/errors';

export default function (
  taskId: string,
  request: IInboundRequest
): IExportData {
  try {
    const exportData: IExportData = {
      taskId: taskId,
      fileName: request.fileName,
      sizeEst: request.sizeEst,
      tilesEst: request.tilesEst,
      bbox: request.bbox,
      directoryName: ''
    };

    return exportData;
  } catch (error) {
    throw new BadRequestError(error);
  }
}
