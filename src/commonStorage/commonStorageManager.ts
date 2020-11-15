import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import Axios, { AxiosResponse, AxiosError } from 'axios';
import { get } from 'config';
import { StatusCodes } from 'http-status-codes';
import Urls from '../requests/urls';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
import { IExportData } from '../model/exportRequest';
import { IExportStatusData, IExportStatusDisplay } from '../model/exportStatus';
import requestToStatus from '../util/requestToStatus';
import {
  GetStatusError,
  SaveExportDataError,
  DeleteExportDataError,
} from '../requests/errors/status';
import statusToResponse from '../util/statusToResponse';
import { ExportDataDuplicationError } from '../requests/errors/export';
import { BadRequestError } from '../requests/errors/errors';

@injectable()
export class CommonStorageManager {
  protected config: ICommonStorageConfig;

  public constructor(private readonly logger: MCLogger) {
    this.config = get('commonStorage');
    logger.info(`Status manager created. url=${this.config.url}`);
  }

  public async getGeopackageExecutionStatus(): Promise<IExportStatusDisplay[]> {
    this.logger.debug('Getting geopackage export status');

    try {
      const res: AxiosResponse<IExportStatusData[]> = await Axios.get(
        Urls.commonStorage.getExportStatusLink
      );
      const status: IExportStatusDisplay[] = res.data.map((data) =>
        statusToResponse(data)
      );
      this.logger.debug(
        `Got export status from CommonStorage. Status: ${JSON.stringify(
          status
        )}`
      );
      return status;
    } catch (error) {
      const err: AxiosError = error as AxiosError;
      const errorData: unknown = err.response?.data as unknown;
      if (err.response?.status == StatusCodes.BAD_REQUEST) {
        throw new BadRequestError(error, errorData);
      }
      throw new GetStatusError(error);
    }
  }

  public async saveExportData(exportData: IExportData): Promise<void> {
    this.logger.debug('Saving new export data.');

    try {
      await Axios.post(
        Urls.commonStorage.saveExportDataLink,
        requestToStatus(exportData)
      );
    } catch (error) {
      const err: AxiosError = error as AxiosError;
      const errorData: unknown = err.response?.data as unknown;
      if (err.response?.status == StatusCodes.BAD_REQUEST) {
        throw new BadRequestError(error, errorData);
      }
      if (err.response?.status == StatusCodes.CONFLICT) {
        throw new ExportDataDuplicationError(error, exportData);
      }
      throw new SaveExportDataError(error, exportData);
    }

    this.logger.debug(`Saved export data. Data: ${JSON.stringify(exportData)}`);
  }

  public async deleteExportData(taskId: string): Promise<void> {
    this.logger.debug(`Deleting export data. uuid=${taskId}`);

    try {
      await Axios.post(Urls.commonStorage.deleteExportDataLink, [taskId]);
    } catch (error) {
      throw new DeleteExportDataError(error, taskId);
    }

    this.logger.debug(`Deleted export data for uuid=${taskId}`);
  }
}
