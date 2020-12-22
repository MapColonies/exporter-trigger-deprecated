import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'config';
import { KafkaManager } from '../kafka/manager';
import { CommonStorageManager } from '../commonStorage/commonStorageManager';
import { IInboundRequest } from '../model/exportRequest';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
import outboundRequestString from '../util/outboundRequestToExport';
import exportDataString from '../util/exportDataString';
import { validateBboxArea } from '../util/validateBboxArea';
import isBBoxResolutionValid from '../util/isBBoxResolutionValid';
import { BboxResolutionValidationError } from '../requests/errors/export';

@injectable()
export class ExportGeopackageController {
  protected commonStorageConfig: ICommonStorageConfig;

  public constructor(
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
    // Generate unique task id
    const taskId = uuidv4();

    try {
      // Validate bbox resolution
      if (!isBBoxResolutionValid(requestBody.maxZoom, requestBody.bbox)) {
        throw new BboxResolutionValidationError(
          requestBody.bbox,
          requestBody.maxZoom
        );
      }

      // Get export data from request body
      const exportData = exportDataString(taskId, requestBody);

      // Validate bbox
      validateBboxArea(exportData.polygon, requestBody.bbox);

      // Save export to storage
      await this.commonStorageManager.saveExportData(exportData);

      // Send message to kafka
      const messageToSend = outboundRequestString(taskId, requestBody);

      try {
        await this.kafkaManager.sendMessage(messageToSend);
      } catch (error) {
        // Remove failed export from storage
        await this.commonStorageManager.deleteExportData(taskId);
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    return res.status(httpStatus.OK).json({ uuid: taskId });
  }
}
