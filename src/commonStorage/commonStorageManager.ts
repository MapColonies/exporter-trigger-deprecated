import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import Axios from 'axios';
import { get } from 'config';
import Urls from '../requests/urls';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
import { IExportData } from '../model/exportRequest';
import { createStatusResponseBody } from '../model/exportStatusRequest';

@injectable()
export class CommonStorageManager {
  protected config: ICommonStorageConfig;

  public constructor(private readonly logger: MCLogger) {
    this.config = get('commonStorage');
    logger.info(
      `Status manager created. url=${this.config.url}, index=${this.config.index}`
    );
  }

  public async getGeopackageExecutionStatus() {
    this.logger.debug('Getting geopackage export status');

    try {
      const status = await Axios.get(Urls.commonStorage.getExportStatusLink);
      this.logger.debug(
        `Got export status from CommonStorage. Status: ${status}`
      );
      return status;
    } catch (error) {
      this.logger.error(
        `Failed to get export status, error=${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  public async saveExportData(exportData: IExportData) {
    this.logger.debug('Saving new export data.');
    await Axios.post(Urls.commonStorage.saveExportDataLink, {
      body: createStatusResponseBody(exportData),
    }).catch((error) => {
      this.logger.error(
        `Failed saving export data, error=${JSON.stringify(error)}`
      );
      throw error;
    });

    this.logger.debug(`Saved export data. Data: ${JSON.stringify(exportData)}`);
  }
}
