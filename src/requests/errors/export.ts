import { get } from 'config';
import { IBboxConfig } from '../../model/bboxConfig';
import { IExportData } from '../../model/exportRequest';
import { BadRequestError } from './errors';

const config: IBboxConfig = get('bbox');
const limit = config.limit;

export class ExportDataValidationError extends BadRequestError {
  public constructor(error: Error) {
    super({
      name: 'ERR_EXPORT_DATA_VALIDATION',
      message: `Failed in export validation, reason=${error.message}}`,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExportDataValidationError.prototype);
  }
}

export class BboxValidationError extends ExportDataValidationError {
  public constructor(error: Error, bbox: number[]) {
    super({
      name: error.name,
      message: `Error validating bbox, Cause: ${
        error.message
      }, Bbox=${JSON.stringify(bbox)}`,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExportDataValidationError.prototype);
  }
}

export class BboxAreaValidationError extends BboxValidationError {
  public constructor(bbox: number[]) {
    super(
      {
        name: 'ERR_BBOX_AREA_VALIDATION',
        message: `BBox area exceeds set limit of ${limit} square km`,
      },
      bbox
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BboxAreaValidationError.prototype);
  }
}

export class ExportDataDuplicationError extends BadRequestError {
  public constructor(error: Error, exportData: IExportData) {
    super({
      name: 'ERR_EXPORT_DATA_DUPLICATION',
      message: `Failed saving export data because of duplication of unique fields, data=${JSON.stringify(
        exportData
      )}, error=${JSON.stringify(error)}`,
      stack: error.stack,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExportDataDuplicationError.prototype);
  }
}
