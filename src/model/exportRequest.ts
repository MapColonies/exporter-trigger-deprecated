export interface IInboundRequest {
  fileName: string;
  directoryName: string;
  sizeEst: number;
  tilesEst: number;
  bbox: number[];
  exportedLayers: ILayerData[];
}

export interface ILayerData {
  url: string;
  exportType: string;
}

export interface IOutboundRequest {
  taskId: string;
  fileName: string;
  url: string;
  bbox: number[];
  directoryName: string;
}

export interface IExportData {
  taskId: string;
  fileName: string;
  directoryName: string;
  sizeEst: number;
  tilesEst: number;
  bbox: number[];
}
