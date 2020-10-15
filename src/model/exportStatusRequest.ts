import { IExportData } from '../model/exportRequest';

interface IExportStatusResponse {
  taskId: string;
  fileName: string;
  sizeEst: number;
  tilesEst: number;
  status: string;
  link: string;
  creationDate: string;
  lastUpdateTime: string;
  progress: number;
}

export function createStatusResponseBody(
  exportData: IExportData
): IExportStatusResponse {
  const currentDate = new Date().toISOString();

  return {
    taskId: exportData.taskId,
    fileName: exportData.fileName,
    sizeEst: exportData.sizeEst,
    tilesEst: exportData.tilesEst,
    status: 'pending',
    link: '',
    creationDate: currentDate,
    lastUpdateTime: currentDate,
    progress: 0,
  };
}
