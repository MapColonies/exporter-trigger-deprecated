import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import Axios from 'axios';

import { get } from 'config';
import { IStatusManagerConfig } from '../model/statusManagerConfig';

@injectable()
export class StatusManager {
    protected config: IStatusManagerConfig;
    
    public constructor(private readonly logger: MCLogger) {
        this.config = get('commonStorage');
        logger.info(`Status manager created. url=${this.config.url}, index=${this.config.index}`);
    }

    public async getProgress() {
        this.logger.debug('Getting export progress');
        const status = await Axios.get(`${this.config.url}/indexes/${this.config.index}/document`).catch((error) => {
            this.logger.error(`Failed to get export status, error=${ JSON.stringify(error) }`);
            throw(error);
        });
        return status;
    }
}