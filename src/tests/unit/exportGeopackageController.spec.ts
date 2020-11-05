//this import must be called before the first import of tsyring
import 'reflect-metadata';
import { Request, Response } from 'express';
import { MCLogger } from '@map-colonies/mc-logger';
import { CommonStorageManager } from '../../commonStorage/commonStorageManager';
import { KafkaManager } from '../../kafka/manager';
import { IExportData } from '../../model/exportRequest';
import { ExportGeopackageController } from '../../controllers/exportGeopackage';
import { IInboundRequest } from '../../model/exportRequest';

describe('Common storage manager test', () => {
  let loggerMock: MCLogger;
  let kafkaManager: KafkaManager;
  let commonStorageManager: CommonStorageManager;
  let geopackageController: ExportGeopackageController;

  const request: IInboundRequest = {
    fileName: 'test',
    directoryName: 'temp',
    sizeEst: 100,
    tilesEst: 10,
    bbox: [10, 11, 12, 13],
    exportedLayers: [{ url: 'http://temp.com', exportType: 'raster' }],
  };

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

    kafkaManager = ({
      sendMessage: jest.fn().mockResolvedValue(''),
    } as unknown) as KafkaManager;

    commonStorageManager = ({
      saveExportData: jest.fn(),
    } as unknown) as CommonStorageManager;

    geopackageController = new ExportGeopackageController(
      loggerMock,
      kafkaManager,
      commonStorageManager
    );
  });

  it('exports geopackage and returns uuid', async () => {
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    res.status.mockReturnValue(res);

    await geopackageController.exportRequestHandler(
      ({ body: request } as unknown) as Request,
      (res as unknown) as Response,
      jest.fn()
    );

    expect(kafkaManager.sendMessage).toHaveBeenCalled();
    expect(commonStorageManager.saveExportData).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ uuid: 'taskId' });
  });
});
