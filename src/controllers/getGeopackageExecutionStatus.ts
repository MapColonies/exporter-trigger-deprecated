import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { ExecutionStatusManager } from '../status/executionStatusManager';

@injectable()
export class GetStatusController {
  public constructor(
    @inject(delay(() => ExecutionStatusManager))
    private readonly statusManager: ExecutionStatusManager
  ) {}

  public async exportRequestHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const status = await this.statusManager.getGeopackageExecutionStatus();
      return res.status(httpStatus.OK).json({ status: status.data });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
