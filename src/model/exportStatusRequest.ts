import { Polygon } from '@turf/helpers';
import { IExportData } from '../model/exportRequest';

export interface IExportStatusResponse {
  taskId: string;
  userId: string;
  fileName: string;
  directoryName: string;
  fileURI: string;
  estimatedFileSize: number;
  realFileSize: number;
  tilesEst: number;
  geometry: Polygon;
  status: string;
  creationTime: Date;
  updatedTime: Date;
  expirationTime: Date;
  progress: number;
}

export function createStatusResponseBody(
  exportData: IExportData
): IExportStatusResponse {
  const currentDate = new Date(new Date().toUTCString());
  const userId = 'tester';
  return {
    taskId: exportData.taskId,
    userId: userId,
    fileURI: '',
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
