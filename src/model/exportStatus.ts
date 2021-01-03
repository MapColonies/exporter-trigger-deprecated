import { Polygon } from '@turf/helpers';

export interface IExportStatusData {
  taskId: string;
  userId: string;
  directoryName: string;
  fileName: string;
  fileURI: string;
  estimatedFileSize: number;
  realFileSize: number;
  maxZoom: number;
  geometry: Polygon;
  status: string;
  creationTime: Date;
  updatedTime: Date;
  expirationTime: Date;
  progress: number;
  sourceLayer: string
}

export interface IExportStatusDisplay {
  taskId: string;
  userId: string;
  directoryName: string;
  fileName: string;
  sizeEst: number;
  realSize: number;
  maxZoom: number;
  polygon: Polygon;
  status: string;
  link: string;
  creationDate: Date;
  lastUpdateTime: Date;
  expirationTime: Date;
  progress: number;
  sourceLayer: string;
}
