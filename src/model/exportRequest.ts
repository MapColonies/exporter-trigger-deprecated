export interface IExportRequest {
  'fileName': string,
  'directoryName': string,
  'bbox': string,
  'exportedLayers': ILayerData[]
}

export interface ILayerData {
  'url': string,
  'exportType': string
}
