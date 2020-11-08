import { IExportData } from '../../model/exportRequest';
import { InternalServerError } from './errors';

export class StatusError extends InternalServerError {
  public constructor(error: Error) {
    super(error);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, StatusError.prototype);
  }
}

export class GetStatusError extends StatusError {
  public constructor(error: Error) {
    super({
      name: 'ERR_GET_STATUS',
      message: `Failed to get export status, error=${JSON.stringify(error)}`,
      stack: error.stack,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, GetStatusError.prototype);
  }
}

export class SaveExportDataError extends StatusError {
  public constructor(error: Error, exportData: IExportData) {
    super({
      name: 'ERR_SAVE_EXPORT_STATUS',
      message: `Failed saving export data, data=${JSON.stringify(
        exportData
      )}, error=${JSON.stringify(error)}`,
      stack: error.stack,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SaveExportDataError.prototype);
  }
}

export class DeleteExportDataError extends StatusError {
  public constructor(error: Error, taskId: string) {
    super({
      name: 'ERR_DELETE_EXPORT',
      message: `Failed to delete export data, uuid=${taskId}, error=${JSON.stringify(
        error
      )}`,
      stack: error.stack,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DeleteExportDataError.prototype);
  }
}
