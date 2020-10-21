import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { CommonStorageManager } from '../commonStorage/commonStorageManager';
import { IExportStatusResponse } from '../model/exportStatusRequest';

@injectable()
export class GetExecutionStatusController {
  public constructor(
    @inject(delay(() => CommonStorageManager))
    private readonly commonStorageManager: CommonStorageManager
  ) {}

  public async exportRequestHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const status: IExportStatusResponse = await this.commonStorageManager.getGeopackageExecutionStatus();
      return res.status(httpStatus.OK).json(status);
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
