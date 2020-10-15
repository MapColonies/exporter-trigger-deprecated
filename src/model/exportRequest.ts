export interface IInboundRequest {
  fileName: string;
  directoryName: string;
  sizeEst: number;
  tilesEst: number;
  bbox: Array<number>;
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
  bbox: Array<number>;
}

export interface IExportData {
  taskId: string;
  fileName: string;
  sizeEst: number;
  tilesEst: number;
  bbox: Array<number>;
}
