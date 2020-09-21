export interface IInboundRequest {
  'fileName': string;
  'directoryName': string;
  'bbox': Array<number>;
  'exportedLayers': ILayerData[];
}

export interface ILayerData {
  'url': string;
  'exportType': string;
}

export interface IOutboundRequest {
  'taskId': string;
  'filename': string;
  'url': string;
  'bbox': Array<number>;
}
