import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import config from 'config';
import { MCLogger } from '@map-colonies/mc-logger';
import { IInboundRequest } from '../model/exportRequest';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
import { getPolygon, validateBboxArea } from '../util/validateBboxArea';
import { isBBoxResolutionValid } from '../util/isBBoxResolutionValid';
import { BboxResolutionValidationError } from '../requests/errors/export';
import { JobManagerClient } from '../clients/jobManagerClient';
import { IExportConfig } from '../model/exportConfig';

@injectable()
export class ExportGeopackageController {
  protected commonStorageConfig: ICommonStorageConfig;
  protected exportConfig: IExportConfig;

  public constructor(
    @inject(delay(() => MCLogger)) private readonly logger: MCLogger,
    private readonly jobManager: JobManagerClient
  ) {
    this.commonStorageConfig = config.get('commonStorage');
    this.exportConfig = config.get<IExportConfig>('export');
  }

  public async exportRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const requestBody = req.body as IInboundRequest;

    try {
      // Validate bbox resolution
      if (!isBBoxResolutionValid(requestBody.maxZoom, requestBody.bbox)) {
        throw new BboxResolutionValidationError(
          requestBody.bbox,
          requestBody.maxZoom
        );
      }

      // Validate bbox
      const polygon = getPolygon(requestBody.bbox);
      validateBboxArea(polygon, requestBody.bbox);

      //add default layer if no layer is selected
      if (
        requestBody.exportedLayers === undefined ||
        requestBody.exportedLayers.length === 0 ||
        !!requestBody.exportedLayers[0].sourceLayer
      ) {
        this.logger.info(
          `No specific export layer defined - using default layer: ${this.exportConfig.defaultLayer}`
        );
        requestBody.exportedLayers = [];
        requestBody.exportedLayers.push({
          url: this.exportConfig.defaultUrl,
          sourceLayer: this.exportConfig.defaultLayer,
          exportType: this.exportConfig.defaultType,
        });
      }

      // enqueue task
      const jobId = await this.jobManager.createJob(requestBody);
      return res.status(httpStatus.OK).json(jobId);
    } catch (error) {
      return next(error);
    }
  }
}
