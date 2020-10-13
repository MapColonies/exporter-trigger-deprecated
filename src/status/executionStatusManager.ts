import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import Axios from 'axios';

import { get } from 'config';
import { IExecutionStatusManagerConfig } from '../model/executionStatusManagerConfig';

@injectable()
export class ExecutionStatusManager {
  protected config: IExecutionStatusManagerConfig;

  public constructor(private readonly logger: MCLogger) {
    this.config = get('commonStorage');
    logger.info(
      `Status manager created. url=${this.config.url}, index=${this.config.index}`
    );
  }

  public async getGeopackageExecutionStatus() {
    this.logger.debug('Getting geopackage export status');
    const status = await Axios.get(
      `${this.config.url}/indexes/${this.config.index}/document`
    ).catch((error) => {
      this.logger.error(
        `Failed to get export status, error=${JSON.stringify(error)}`
      );
      throw error;
    });

    this.logger.debug(
      `Got export status from CommonStorage. Status: ${status}`
    );
    return status;
  }
}
