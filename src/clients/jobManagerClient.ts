import config from 'config';
import { injectable, delay, inject } from 'tsyringe';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { MCLogger } from '@map-colonies/mc-logger';
import { v4 as uuid } from 'uuid';
import { IInboundRequest } from '../model/exportRequest';
import { IExportStatusDisplay } from '../model/exportStatus';
import { getPolygon } from '../util/validateBboxArea';
import {
  IJobCreationResponse,
  ICreateJobBody,
  ICreateJobResponse,
  IWorkerInput,
  IGetJobResponse,
  IJobData,
  IGetTaskResponse,
  ITaskData,
} from '../util/interfaces';
import { zoomLevelFromRes } from '../util/utils';

@injectable()
export class JobManagerClient extends HttpClient {
  private readonly gdalJobType: string;
  private readonly gdalTaskType: string;
  private readonly tilesJobType: string;
  private readonly tilesTaskType: string;
  private readonly expirationTime: number;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public constructor(
    @inject(delay(() => MCLogger)) protected readonly logger: MCLogger
  ) {
    const retryConfig = config.get<IHttpRetryConfig>('httpRetry');
    const baseURL = config.get<string>('commonStorage.url');
    super(logger, baseURL, 'JobManager', retryConfig);
    this.gdalJobType = config.get<string>('workerTypes.gdal.jobType');
    this.gdalTaskType = config.get<string>('workerTypes.gdal.taskType');
    this.tilesJobType = config.get<string>('workerTypes.tiles.jobType');
    this.tilesTaskType = config.get<string>('workerTypes.tiles.taskType');
    this.expirationTime = config.get<number>('commonStorage.expirationTime')
  }

  public async createJob(data: IInboundRequest): Promise<IJobCreationResponse> {
    const resourceId = uuid();
    const version = '1';
    const createLayerTasksUrl = `/jobs`;
    const expirationTime = new Date();
    expirationTime.setDate(
      expirationTime.getDate() +
       this.expirationTime
    );
    const createJobRequest: ICreateJobBody = {
      resourceId: resourceId,
      version: version,
      type: this.gdalJobType,
      parameters: {
        ...data,
        userId: 'tester', // TODO: replace with request value
      },
      tasks: [
        {
          type: this.gdalTaskType,
          parameters: {
            directoryName: data.directoryName,
            fileName: data.fileName,
            url: data.exportedLayers?.[0].url,
            bbox: data.bbox,
            maxZoom: data.maxZoom,
            expirationTime: expirationTime,
            fileURI: '',
            realFileSize: 0,
          },
        },
      ],
    };

    this.logger.info(
      `creating job and task for ${data.directoryName}/${data.fileName}`
    );
    const res = await this.post<ICreateJobResponse>(
      createLayerTasksUrl,
      createJobRequest
    );
    return {
      jobId: res.id,
      taskId: res.taskIds[0],
    };
  }

  public async createJobGM(data: IWorkerInput): Promise<IJobCreationResponse> {
    const resourceId = data.cswProductId;
    const version = data.version;
    const createLayerTasksUrl = `/jobs`;
    const zoomLevel = zoomLevelFromRes(data.targetResolution);

    const expirationTime = new Date();
    expirationTime.setDate(
      expirationTime.getDate() +
      this.expirationTime
    );
    const createJobRequest: ICreateJobBody = {
      resourceId: resourceId,
      version: version,
      type: this.tilesJobType,
      parameters: {
        ...data,
        userId: 'tester', // TODO: replace with request value
      },
      tasks: [
        {
          type: this.tilesTaskType,
          parameters: {
            dbId: data.dbId,
            crs: data.crs,
            zoomLevel,
            url: data.url,
            bbox: data.bbox,
            expirationTime: expirationTime,
            priority: data.priority,
            tilesPath: data.tilesPath,
            footprint: data.footprint,
            packageName: data.packageName
          },
        },
      ],
    };

    this.logger.info(`creating job and task for ${data.dbId}`);
    const res = await this.post<ICreateJobResponse>(
      createLayerTasksUrl,
      createJobRequest
    );
    return {
      jobId: res.id,
      taskId: res.taskIds[0],
    };
  }

  public async getGeopackageExecutionStatus(): Promise<IExportStatusDisplay[]> {
    const getLayerUrl = `/jobs`;
    const res = await this.get<IGetJobResponse[]>(getLayerUrl, {
      type: this.gdalJobType,
    });
    if (typeof res === 'string' || res.length === 0) {
      return [];
    }
    const statuses = res.map((job) => {
      const jobData = job.parameters as unknown as IJobData;
      const task = job.tasks?.[0] as IGetTaskResponse;
      const taskData = task.parameters as unknown as ITaskData;
      const status: IExportStatusDisplay = {
        taskId: task.id,
        userId: jobData.userId,
        directoryName: jobData.directoryName,
        fileName: jobData.fileName,
        sizeEst: jobData.sizeEst,
        realSize: 0,
        maxZoom: jobData.maxZoom,
        polygon: getPolygon(jobData.bbox),
        status: task.status as string,
        link: taskData.fileURI,
        creationDate: job.created,
        lastUpdateTime: task.updated,
        expirationTime: taskData.expirationTime,
        progress: task.percentage as number,
        sourceLayer: jobData.exportedLayers?.[0]?.sourceLayer as string,
      };
      return status;
    });
    return statuses;
  }
}
