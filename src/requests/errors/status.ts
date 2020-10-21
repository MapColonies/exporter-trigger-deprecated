import { IExportData } from '../../model/exportRequest';
import { InternalServerError } from './errors';

export class StatusError extends InternalServerError {
  public constructor(error: Error) {
    super(error);
  }
}

export class GetStatusError extends StatusError {
  public constructor(error: Error) {
    super({
      name: 'Get status error',
      message: `Failed to get export status, error=${JSON.stringify(error)}`,
      stack: error.stack,
    });
  }
}

export class SaveExportDataError extends StatusError {
  public constructor(error: Error, exportData: IExportData) {
    super({
      name: 'Save export status error',
      message: `Failed saving export data, data=${exportData}, error=${JSON.stringify(
        error
      )}`,
      stack: error.stack,
    });
  }
}
