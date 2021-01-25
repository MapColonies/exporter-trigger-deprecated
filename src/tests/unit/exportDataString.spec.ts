import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import { ILoggerConfig, IServiceConfig, MCLogger } from '@map-colonies/mc-logger';
import exportDataString from '../../util/exportDataString';
import * as bbox from '../../util/validateBboxArea';
import { IExportData, ILayerData } from '../../model/exportRequest';
import { IExportConfig } from '../../model/exportConfig';
/* eslint-disable */
import { get } from '../../../__mock__/config';
import { mockRequest } from './mock/mockRequest';
import { mockPolygon } from './mock/mockPoligon';

describe('Export Geopackage', () => {
  let getPolygon: jest.SpyInstance;
  let exportConfig: IExportConfig;
  let loggerConfig: ILoggerConfig;
  let serviceConfig: IServiceConfig;
  beforeEach(()=>{
    getPolygon = jest.spyOn(bbox, 'getPolygon');
    get.mockImplementation((key: string)=>{
      switch (key) {
        case 'bbox':
          return {limit: '10000'}
        case 'export':
          exportConfig = {
            defaultUrl: "http://mock-url/",
            defaultLayer: "mock-layer",
            defaultType: "raster"
          }
          return exportConfig;
        case 'logger':
          return {level: 'error'}
        case 'service':
          return {name: 'testService', version: '0.1'}
        default:
          break;
      }
    })
    exportConfig = get('export');
    loggerConfig = get('logger');
    serviceConfig = get('service');
  })
  afterEach(()=>{
    jest.resetAllMocks();
  })
  it('Should call export with deafult url and layer', () => {
    // mock
    getPolygon.mockReturnValueOnce(mockPolygon);
    const mockTaskId: string = uuidv4();
    // action
    const exportData: IExportData = exportDataString(mockTaskId, mockRequest, new MCLogger(loggerConfig, serviceConfig));
    // expect
    expect(Object.keys(exportData)).toContain('exportedLayer');
    expect(Object.keys(exportData.exportedLayer)).toContain('url');
    expect(Object.keys(exportData.exportedLayer)).toContain('sourceLayer');
    expect(Object.keys(exportData.exportedLayer)).toContain('exportType');
    expect(exportData.exportedLayer.url).toBe(exportConfig.defaultUrl);
    expect(exportData.exportedLayer.sourceLayer).toBe(exportConfig.defaultLayer);
    expect(exportData.exportedLayer.exportType).toBe(exportConfig.defaultType);
  })
  it('Should call export with the requested url and layer', () => {
    // mock
    getPolygon.mockReturnValueOnce(mockPolygon);
    const mockTaskId: string = uuidv4();
    const mockLayerOptions: ILayerData = {
      url: "http://requested-url/",
      sourceLayer: 'requested-source-layer',
      exportType: 'raster'
    }

    mockRequest.exportedLayers = [] as ILayerData[];
    mockRequest.exportedLayers.push(mockLayerOptions);
    // action
    const exportData: IExportData = exportDataString(mockTaskId, mockRequest, new MCLogger(loggerConfig, serviceConfig));
    // expect
    expect(Object.keys(exportData)).toContain('exportedLayer');
    expect(Object.keys(exportData.exportedLayer)).toContain('url');
    expect(Object.keys(exportData.exportedLayer)).toContain('sourceLayer');
    expect(Object.keys(exportData.exportedLayer)).toContain('exportType');
    expect(exportData.exportedLayer.url).toBe(mockLayerOptions.url);
    expect(exportData.exportedLayer.sourceLayer).toBe(mockLayerOptions.sourceLayer);
    expect(exportData.exportedLayer.exportType).toBe(mockLayerOptions.exportType);
  })
});
