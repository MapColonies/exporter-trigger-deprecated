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

const jobType = config.get<string>('commonStorage.jobType');
const taskType = config.get<string>('commonStorage.taskType');
@injectable()
export class JobManagerClient extends HttpClient {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public constructor(
    @inject(delay(() => MCLogger)) protected readonly logger: MCLogger
  ) {
    const retryConfig = config.get<IHttpRetryConfig>('httpRetry');
    const baseURL = config.get<string>('commonStorage.url');
    super(logger, baseURL, 'JobManager', retryConfig);
  }

  public async createJob(data: IInboundRequest): Promise<IJobCreationResponse> {
    const resourceId = uuid();
    const version = '1';
    const createLayerTasksUrl = `/jobs`;
    const expirationTime = new Date();
    expirationTime.setDate(
      expirationTime.getDate() +
        config.get<number>('commonStorage.expirationTime')
    );
    const createJobRequest: ICreateJobBody = {
      resourceId: resourceId,
      version: version,
      type: jobType,
      parameters: {
        ...data,
        userId: 'tester', // TODO: replace with request value
      },
      tasks: [
        {
          type: taskType,
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
    const resourceId = data.cswLayerId;
    const version = data.version;
    const createLayerTasksUrl = `/jobs`;
    const expirationTime = new Date();
    expirationTime.setDate(
      expirationTime.getDate() +
        config.get<number>('commonStorage.expirationTime')
    );
    const createJobRequest: ICreateJobBody = {
      resourceId: resourceId,
      version: version,
      type: jobType,
      parameters: {
        ...data,
        userId: 'tester', // TODO: replace with request value
      },
      tasks: [
        {
          type: taskType,
          parameters: {
            layerId: data.layerId,
            crs: data.crs,
            maxZoomLevel: data.maxZoomLevel,
            url: data.url,
            bbox: data.bbox,
            expirationTime: expirationTime,
            priority: data.priority,
            tilesPath: data.tilesPath,
            footprint: data.footprint
          },
        },
      ],
    };

    this.logger.info(`creating job and task for ${data.layerId}`);
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
      type: jobType,
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
