import { get } from 'config';
import { ICommonStorageConfig } from '../model/commonStorageConfig';
const commonStorageConfig: ICommonStorageConfig = get('commonStorage');

export default {
  commonStorage: {
    getExportStatusLink: `${commonStorageConfig.url}/indexes/${commonStorageConfig.index}/document`,
    saveExportDataLink: `${commonStorageConfig.url}/indexes/${commonStorageConfig.index}/document`,
  },
};
