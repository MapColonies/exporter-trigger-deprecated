import 'reflect-metadata';
import exportDataString from '../../util/exportDataString';
import { v4 as uuidv4 } from 'uuid';
import { IExportData, IInboundRequest } from '../../model/exportRequest';
import { IExportConfig } from '../../model/exportConfig';
import { get } from 'config';

describe('Export Geopackage', () => {
  let exportConfig: IExportConfig;
  beforeEach(()=>{
    exportConfig = get('export');
  })
  it('Should call export with deafult url and layer', () => {
    // mock
    const mockTaskId: string = uuidv4();
    const mockRequest: IInboundRequest = {
      fileName: 'test_file',
      directoryName: 'test_directory',
      bbox: [
        34.811938017107494,
        31.95475033759175,
        34.82237261707599,
        31.96426962177354
      ],
      exportedLayers: [
        {
          url: 'http://test/geoserver/ows?service=wms',
          exportType: 'raster'
        }
      ],
      sizeEst: 30,
      maxZoom: 18
    }
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