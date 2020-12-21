import { get } from 'config';
import { IBboxConfig } from '../../model/bboxConfig';
import { IExportData } from '../../model/exportRequest';
import { BadRequestError, ConflictError } from './errors';

const config: IBboxConfig = get('bbox');
const limit = config.limit;

export enum BboxLimit {
  EXCEEDS,
  TOO_SMALL,
}

function getLimitErrorMessage(limitKind: BboxLimit): string {
  return limitKind == BboxLimit.EXCEEDS
    ? `BBox area exceeds set limit of ${limit} square km`
    : 'BBox area cannot be smaller than 1 square meter';
}

function getLimitErrorName(limitKind: BboxLimit): string {
  return limitKind == BboxLimit.EXCEEDS
    ? 'ERR_BBOX_AREA_TOO_LARGE'
    : 'ERR_BBOX_AREA_TOO_SMALL';
}

export class ExportDataValidationError extends BadRequestError {
  public constructor(error: Error) {
    super({
      name: error.name,
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
  public constructor(bbox: number[], limitViolation: BboxLimit) {
    super(
      {
        name: getLimitErrorName(limitViolation),
        message: getLimitErrorMessage(limitViolation),
      },
      bbox
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BboxAreaValidationError.prototype);
  }
}

export class BboxResolutionValidationError extends BboxValidationError {
  public constructor(bbox: number[], zoomLevel: number) {
    super(
      {
        name: 'ERR_BBOX_RESOLUTION_VALIDATION_ERROR',
        message: `BBox resolution is too small for wanted zoom level, zoom level: ${zoomLevel}`,
      },
      bbox
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BboxResolutionValidationError.prototype);
  }
}

export class ExportDataDuplicationError extends ConflictError {
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
