import { get } from 'config';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
const commonStorageConfig: ICommonStorageConfig = get('commonStorage');

export default {
  commonStorage: {
    getExportStatusLink: `${commonStorageConfig.url}/statuses`,
    saveExportDataLink: `${commonStorageConfig.url}/statuses`,
  },
};
