import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { KafkaManager } from '../kafka/manager';
import { IExportRequest } from '../model/exportRequest';

@injectable()
export class ExportGeopackageController {

  public constructor(@inject(delay(() => KafkaManager)) private readonly kafkaManager: KafkaManager) {
  }

  public async post(req: Request, res: Response): Promise<Response> {
    try {
      const requestBody = req.body as IExportRequest;
      const message = JSON.stringify(requestBody);
      await this.kafkaManager.sendMessage(message);
      return res.status(httpStatus.OK).json({ hello: 'world' });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
}
