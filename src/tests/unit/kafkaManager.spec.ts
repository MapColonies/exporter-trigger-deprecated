//this import must be called before the first import of tsyring
import 'reflect-metadata';
import MockAdapter from 'axios-mock-adapter';
import { MCLogger } from '@map-colonies/mc-logger';
import Urls from '../../requests/urls';
import { CommonStorageManager } from '../../commonStorage/commonStorageManager';
import { IExportData } from '../../model/exportRequest';
import { KafkaManager } from '../../kafka/manager';

describe('Common storage manager test', () => {
  let loggerMock: MCLogger;
  let kafkaManager: KafkaManager;

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

    kafkaManager = new KafkaManager(loggerMock);
  });

  beforeEach(() => {
  });

  it('gets geopackage execution status', () => {
    kafkaManager.sendMessage("Message");
    expect(kafkaManager.)
  });
});
