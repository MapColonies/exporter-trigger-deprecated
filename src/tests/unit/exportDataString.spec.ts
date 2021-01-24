import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'config';
import exportDataString from '../../util/exportDataString';
import * as bboxAreaValidate from '../../util/validateBboxArea';
import { IExportData } from '../../model/exportRequest';
import { IExportConfig } from '../../model/exportConfig';
import { mockRequest } from './mock/mockRequest';
import { mockPolygon } from './mock/mockPoligon';

describe('Export Geopackage', () => {
  let exportConfig: IExportConfig;
  let getPoligonSpy: jest.SpyInstance;
  beforeEach(()=>{
    exportConfig = get('export');
  })
  it('Should call export with deafult url and layer', () => {
    // mock
    getPoligonSpy = jest.spyOn(bboxAreaValidate, 'getPolygon');
    const mockTaskId: string = uuidv4();
    getPoligonSpy.mockReturnValueOnce(mockPolygon);
    // action
    const exportData: IExportData = exportDataString(mockTaskId, mockRequest);
    // expect
    expect(Object.keys(exportData)).toContain('exportedLayer');
    expect(Object.keys(exportData.exportedLayer)).toContain('url');
    expect(Object.keys(exportData.exportedLayer)).toContain('sourceLayer');
    expect(exportData.exportedLayer.url).toBe(exportConfig.defaultUrl);
    expect(exportData.exportedLayer.sourceLayer).toBe(exportConfig.defaultLayer);
  })
});