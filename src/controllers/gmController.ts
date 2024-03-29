import { sep } from 'path';
import { MCLogger } from '@map-colonies/mc-logger';
import { MultiPolygon, Polygon } from '@turf/helpers/dist/js/lib/geojson';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { delay, inject, injectable } from 'tsyringe';
import config from 'config';
import axios from 'axios';
import { LayerMetadata } from '@map-colonies/mc-model-types';
import { JobManagerClient } from '../clients/jobManagerClient';
import {
  IUserInput,
  IRasterCatalogManager,
  IWorkerInput,
} from '../util/interfaces';
import { DEFAULT_CRS, DEFAULT_PRIORITY } from '../util/utils';

export type RequestBody = Request<undefined, undefined, IUserInput>;

@injectable()
export class GMController {
  private readonly rasterCatalogManagerConfig: IRasterCatalogManager;

  public constructor(
    @inject(delay(() => MCLogger))
    private readonly logger: MCLogger,
    private readonly jobManager: JobManagerClient
  ) {
    this.rasterCatalogManagerConfig = config.get<IRasterCatalogManager>(
      'rasterCatalogManager'
    );
  }

  public async start(
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const input: IUserInput = req.body;
      this.logger.info(`Retrieving record with id ${req.body.dbId}`);
      const layer = (
        (
          await axios.post(
            `${this.rasterCatalogManagerConfig.url}/records/find`,
            { id: req.body.dbId }
          )
        ).data as (Record<string, unknown> | undefined)[]
      )[0];

      if (layer === undefined) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({
            message: `Could not find layer with dbID: ${req.body.dbId}`,
          });
      }

      const layerMetadata = layer.metadata as LayerMetadata;

      const workerInput: IWorkerInput = {
        footprint: layerMetadata.footprint as Polygon | MultiPolygon,
        bbox: input.bbox,
        version: layerMetadata.productVersion as string,
        cswProductId: layerMetadata.productId as string,
        targetResolution: input.targetResolution,
        dbId: input.dbId,
        packageName: input.packageName,
        callbackURL: input.callbackURL,
        tilesPath:
          (layerMetadata.productId as string) +
          sep +
          (layerMetadata.productVersion as string),
        priority: input.priority ?? DEFAULT_PRIORITY,
        crs: input.crs ?? DEFAULT_CRS,
      };

      const jobCreated = await this.jobManager.createJobGM(workerInput);
      return res.status(httpStatus.OK).json(jobCreated);
    } catch (error) {
      return next(error);
    }
  }
}
