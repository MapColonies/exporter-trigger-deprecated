import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { StatusManager } from '../status/statusManager';

@injectable()
export class GetStatusController {

  public constructor(@inject(delay(() => StatusManager)) private readonly statusManager: StatusManager) {
  }

  public async exportRequestHandler(req: Request, res: Response): Promise<Response> {
    try {
        const status = await this.statusManager.getProgress();
        console.log(status);
        return res.status(httpStatus.OK).json({ status: status.data });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}