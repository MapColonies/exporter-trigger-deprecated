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
import { sep } from 'path';

export type RequestBody = Request<undefined, undefined, IUserInput>;

@injectable()
export class GMController {
  private readonly rasterCatalogManagerConfig: IRasterCatalogManager;
  private readonly tilesMountPath: string;

  public constructor(
    @inject(delay(() => MCLogger))
    private readonly logger: MCLogger,
    private readonly jobManager: JobManagerClient
  ) {
    this.rasterCatalogManagerConfig = config.get<IRasterCatalogManager>(
      'rasterCatalogManager'
    );
    this.tilesMountPath = config.get<string>('tilesMountPath');
  }

  public async start(
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const input: IUserInput = req.body;
      const layer = (
        (
          await axios.post(
            `${this.rasterCatalogManagerConfig.url}/records/find`,
            { id: req.body.layerId }
          )
        ).data as Record<string, unknown>[]
      )[0];

      const layerMetadata = layer.metadata as LayerMetadata;

      const workerInput: IWorkerInput = {
        footprint: layer.footprint as Polygon | MultiPolygon,
        bbox: input.bbox,
        version: layerMetadata.productVersion as string,
        cswLayerId: layerMetadata.productId as string,
        maxZoomLevel: input.maxZoomLevel,
        layerId: input.layerId,
        url: input.url,
        tilesPath:
          this.tilesMountPath +
          sep +
          layerMetadata.producerName +
          sep +
          layerMetadata.productVersion,
      };

      const jobCreated = await this.jobManager.createJobGM(workerInput);
      return res.status(httpStatus.OK).json(jobCreated);
    } catch (error) {
      return next(error);
    }
  }
}
