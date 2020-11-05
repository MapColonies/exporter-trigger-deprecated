//this import must be called before the first import of tsyring
import 'reflect-metadata';
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MCLogger } from '@map-colonies/mc-logger';
import Urls from '../../requests/urls';
import { CommonStorageManager } from '../../commonStorage/commonStorageManager';
import { IExportData } from '../../model/exportRequest';

describe('Common storage manager test', () => {
  let loggerMock: MCLogger;
  let commonStorageManager: CommonStorageManager;
  let axiosMock: MockAdapter;

  const data: IExportData = {
    taskId: '1',
    fileName: 'temp',
    sizeEst: 100,
    tilesEst: 10,
    bbox: [10, 11, 12, 13],
  };

  beforeAll(() => {
    loggerMock = ({
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown) as MCLogger;

    commonStorageManager = new CommonStorageManager(loggerMock);
  });

  beforeEach(() => {
    axiosMock = new MockAdapter(Axios);
  });

  it('gets geopackage execution status', () => {
    axiosMock.onGet(Urls.commonStorage.getExportStatusLink).reply(200, data);
    commonStorageManager.getGeopackageExecutionStatus().then((response) => {
      expect(response).toEqual(data);
    });
  });
});
