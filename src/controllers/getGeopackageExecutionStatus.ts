import { MCLogger } from '@map-colonies/mc-logger';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import { JobManagerClient } from '../clients/jobManagerClient';
import { IExportStatusDisplay } from '../model/exportStatus';

@injectable()
export class GetExecutionStatusController {
  public constructor(
    @inject(delay(() => MCLogger))
    private readonly logger: MCLogger,
    private readonly jobManager: JobManagerClient
  ) {}

  public async exportStatusRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const status: IExportStatusDisplay[] =
        await this.jobManager.getGeopackageExecutionStatus();
      return res.status(httpStatus.OK).json(status);
    } catch (error) {
      return next(error);
    }
  }
}
