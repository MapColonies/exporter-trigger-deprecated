import { Polygon, MultiPolygon } from "@turf/helpers";
import { BBox2d } from "@turf/helpers/dist/js/lib/geojson";
import { IInboundRequest, IOutboundRequest } from "../model/exportRequest";

export enum OperationStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export interface IJobCreationResponse {
  jobId: string;
  taskId: string;
}

export interface ICreateTaskBody {
  description?: string;
  parameters: Record<string, unknown>;
  reason?: string;
  type?: string;
  status?: OperationStatus;
  attempts?: number;
}

export interface ICreateJobBody {
  resourceId: string;
  version: string;
  parameters: Record<string, unknown>;
  type: string;
  description?: string;
  status?: OperationStatus;
  reason?: string;
  tasks?: ICreateTaskBody[];
}

export interface ICreateJobResponse {
  id: string;
  taskIds: string[];
}

export interface IGetTaskResponse {
  id: string;
  jobId: string;
  description?: string;
  parameters?: Record<string, unknown>;
  created: Date;
  updated: Date;
  status: OperationStatus;
  percentage?: number;
  reason?: string;
  attempts: number;
}

export interface IGetJobResponse {
  id: string;
  resourceId?: string;
  version?: string;
  description?: string;
  parameters?: Record<string, unknown>;
  reason?: string;
  tasks?: IGetTaskResponse[];
  created: Date;
  updated: Date;
  status?: OperationStatus;
  percentage?: number;
  isCleaned: boolean;
}

export interface IJobData extends IInboundRequest {
  userId: string;
}

export interface ITaskData extends IOutboundRequest {
  expirationTime: Date;
  fileURI: string;
  realFileSize: number;
}

export interface IWorkerInput extends IUserInput {
  footprint: Polygon | MultiPolygon;
  bbox: BBox2d;
  version: string;
  cswLayerId: string;
}

export interface SwaggerServer {
    [key: string]: unknown;
    url: string;
  }

  export interface IUserInput {
    layerId: string;
    maxZoomLevel: number;
    crs?: string;
    url: string;
    bbox: BBox2d;
    priority?: number;
  }
  
  export interface IRasterCatalogManager {
    url: string;
  }

