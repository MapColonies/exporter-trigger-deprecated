import { MCLogger } from '@map-colonies/mc-logger';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { CommonStorageManager } from '../commonStorage/commonStorageManager';
import { IExportStatusResponse } from '../model/exportStatusRequest';

@injectable()
export class GetExecutionStatusController {
  public constructor(
    @inject(delay(() => MCLogger))
    private readonly logger: MCLogger,
    @inject(delay(() => CommonStorageManager))
    private readonly commonStorageManager: CommonStorageManager
  ) {}

  public async exportStatusRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const status: IExportStatusResponse = await this.commonStorageManager.getGeopackageExecutionStatus();
      return res.status(httpStatus.OK).json(status);
    } catch (error) {
      return next(error);
    }
  }
}
