import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'config';
import { MCLogger } from '@map-colonies/mc-logger';
import { KafkaManager } from '../kafka/manager';
import { CommonStorageManager } from '../commonStorage/commonStorageManager';
import { IInboundRequest } from '../model/exportRequest';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
import outboundRequestString from '../util/outboundRequestToExport';
import exportDataString from '../util/exportDataString';
import validateBboxArea from '../util/validateBboxArea';
import { BboxAreaValidationError } from '../requests/errors/export';

@injectable()
export class ExportGeopackageController {
  protected commonStorageConfig: ICommonStorageConfig;

  public constructor(
    @inject(delay(() => MCLogger))
    private readonly logger: MCLogger,
    @inject(delay(() => KafkaManager))
    private readonly kafkaManager: KafkaManager,
    @inject(delay(() => CommonStorageManager))
    private readonly commonStorageManager: CommonStorageManager
  ) {
    this.commonStorageConfig = get('commonStorage');
  }

  public async exportRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const requestBody = req.body as IInboundRequest;
    const taskId = uuidv4();

    try {
      const messageToSend = outboundRequestString(taskId, requestBody);
      await this.kafkaManager.sendMessage(messageToSend);

      const exportData = exportDataString(taskId, requestBody);
      const bbox = exportData.bbox;
      const valid = validateBboxArea(bbox);
      if (!valid) {
        throw new BboxAreaValidationError(bbox);
      }

      await this.commonStorageManager.saveExportData(exportData);
    } catch (error) {
      return next(error);
    }

    return res.status(httpStatus.OK).json({ uuid: taskId });
  }
}
