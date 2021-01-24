import { Polygon } from '@turf/helpers';

export interface IInboundRequest {
  fileName: string;
  directoryName: string;
  sizeEst: number;
  maxZoom: number;
  bbox: number[];
  exportedLayers: ILayerData[];
}

export interface ILayerData {
  url: string;
  exportType: string;
  sourceLayer?: string;
}

export interface IOutboundRequest {
  taskId: string;
  directoryName: string;
  fileName: string;
  url: string;
  bbox: number[];
  maxZoom: number;
}

export interface IExportData {
  taskId: string;
  fileName: string;
  directoryName: string;
  sizeEst: number;
  maxZoom: number;
  polygon: Polygon;
  exportedLayer: ILayerData;
}
