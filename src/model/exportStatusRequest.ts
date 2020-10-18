import { IExportData } from '../model/exportRequest';

interface IExportStatusResponse {
  taskId: string;
  fileName: string;
  sizeEst: number;
  tilesEst: number;
  bbox: {
    topRight: {
      lat: number;
      lon: number;
    };
    bottomLeft: {
      lat: number;
      lon: number;
    };
  };
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
    bbox: {
      topRight: {
        lat: exportData.bbox[3],
        lon: exportData.bbox[2],
      },
      bottomLeft: {
        lat: exportData.bbox[1],
        lon: exportData.bbox[0],
      },
    },
    status: 'pending',
    link: '',
    creationDate: currentDate,
    lastUpdateTime: currentDate,
    progress: 0,
  };
}
