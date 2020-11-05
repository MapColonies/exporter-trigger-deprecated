import { IExportData } from '../model/exportRequest';
import { IExportStatusData } from '../model/exportStatus';

export default function (exportData: IExportData): IExportStatusData {
  const currentDate = new Date(new Date().toUTCString());
  const userId = 'tester';
  return {
    taskId: exportData.taskId,
    userId: userId,
    fileURI: exportData.directoryName,
    fileName: exportData.fileName,
    directoryName: exportData.directoryName,
    estimatedFileSize: exportData.sizeEst,
    realFileSize: 0,
    tilesEst: exportData.tilesEst,
    geometry: exportData.polygon,
    status: 'pending',
    creationTime: currentDate,
    expirationTime: currentDate, // todo: set expiration
    updatedTime: currentDate,
    progress: 0,
  };
}
