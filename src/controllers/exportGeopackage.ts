import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { KafkaManager } from '../kafka/manager';
import { CommonStorageManager } from '../commonStorage/commonStorageManager';
import { IInboundRequest, IOutboundRequest } from '../model/exportRequest';
import { get } from 'config';
import { ICommonStorageConfig } from '../model/commonStorageConfig';

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
    res: Response
  ): Promise<Response> {
    const requestBody = req.body as IInboundRequest;
    const taskId = uuidv4();
    let messageToSend: string;
    try {
      const parsedMessage: IOutboundRequest = {
        taskId: taskId,
        fileName: requestBody.fileName,
        url: requestBody.exportedLayers[0].url,
        bbox: requestBody.bbox,
      };
      messageToSend = JSON.stringify(parsedMessage);
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json(err);
    }

    try {
      await this.kafkaManager.sendMessage(messageToSend);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const statusCode =
        err && err.meta && err.meta.body && err.meta.body.status
          ? err.meta.body.status
          : httpStatus.INTERNAL_SERVER_ERROR;
      return res.status(statusCode).json(err);
    }

    try {
      await this.commonStorageManager.saveExportData({
        taskId: taskId,
        fileName: requestBody.fileName,
        sizeEst: requestBody.sizeEst,
        tilesEst: requestBody.tilesEst,
        bbox: requestBody.bbox,
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }

    return res.status(httpStatus.OK).json({ uuid: taskId });
  }
}
