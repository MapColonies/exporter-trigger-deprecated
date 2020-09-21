import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { KafkaManager } from '../kafka/manager';
import { IInboundRequest, IOutboundRequest } from '../model/exportRequest';

@injectable()
export class ExportGeopackageController {

  public constructor(@inject(delay(() => KafkaManager)) private readonly kafkaManager: KafkaManager) {
  }

  public async exportRequestHandler(req: Request, res: Response): Promise<Response> {
    const requestBody = req.body as IInboundRequest;
    let messageToSend : string;
    try {
      const parsedMessage : IOutboundRequest = {
        taskId: 'test',
        filename: requestBody.fileName,
        url: requestBody.exportedLayers[0].url,
        bbox: requestBody.bbox
      }
      messageToSend = JSON.stringify(parsedMessage);
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json(err);
    }

    try {
      await this.kafkaManager.sendMessage(messageToSend);
      return res.status(httpStatus.OK).json({ success: true });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const statusCode = err && err.meta && err.meta.body && err.meta.body.status ? err.meta.body.status : httpStatus.INTERNAL_SERVER_ERROR;
      return res.status(statusCode).json(err);
    }
  }
}
