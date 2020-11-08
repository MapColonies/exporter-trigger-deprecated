import { Polygon } from '@turf/helpers';

export interface IInboundRequest {
  fileName: string;
  directoryName: string;
  sizeEst: number;
  bbox: number[];
  exportedLayers: ILayerData[];
}

export interface ILayerData {
  url: string;
  exportType: string;
}

export interface IOutboundRequest {
  taskId: string;
  directoryName: string;
  fileName: string;
  url: string;
  bbox: number[];
}

export interface IExportData {
  taskId: string;
  fileName: string;
  directoryName: string;
  sizeEst: number;
  polygon: Polygon;
}
