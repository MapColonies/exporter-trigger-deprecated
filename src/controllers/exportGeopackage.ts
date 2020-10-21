import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'config';
import { KafkaManager } from '../kafka/manager';
import { CommonStorageManager } from '../commonStorage/commonStorageManager';
import { IInboundRequest } from '../model/exportRequest';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
import { HttpError } from '../requests/errors/errors';
import outboundRequestString from '../util/outboundRequestToExport';
import exportDataString from '../util/exportDataString';
import { MCLogger } from '@map-colonies/mc-logger';

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
      await this.commonStorageManager.saveExportData(
        exportDataString(taskId, requestBody)
      );
    } catch (error) {
      this.logger.error(`Failed export, error=${JSON.stringify(error)}`);

      if (error instanceof HttpError) {
        return res.status(error.status).json(error.name);
      }
      return next(error);
    }

    return res.status(httpStatus.OK).json({ uuid: taskId });
  }
}
