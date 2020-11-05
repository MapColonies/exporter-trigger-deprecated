import { IExportStatusData, IExportStatusDisplay } from '../model/exportStatus';

export default function (statusData: IExportStatusData): IExportStatusDisplay {
  const polygon = statusData.geometry;

  return {
    taskId: statusData.taskId,
    userId: statusData.userId,
    directoryName: statusData.directoryName,
    fileName: statusData.fileName,
    sizeEst: statusData.estimatedFileSize,
    tilesEst: statusData.tilesEst,
    polygon: polygon,
    status: statusData.status,
    link: statusData.fileURI,
    creationDate: statusData.creationTime,
    lastUpdateTime: statusData.updatedTime,
    expirationTime: statusData.expirationTime,
    progress: statusData.progress,
  };
}
