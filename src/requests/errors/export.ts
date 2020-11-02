import { get } from 'config';
import { IBboxConfig } from '../../model/bboxConfig';
import { BadRequestError } from './errors';

const config: IBboxConfig = get('bbox');
const limit = config.limit;

export class ExportDataValidationError extends BadRequestError {
  public constructor(error: Error) {
    super({
      name: `Export data validation error. ${error.name}`,
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
      message: `Error validating bbox, Cause: ${error.message}, Bbox=${JSON.stringify(bbox)}`,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExportDataValidationError.prototype);
  }
}

export class BboxAreaValidationError extends BboxValidationError {
  public constructor(bbox: number[]) {
    super(
      {
        name: 'BBox area validation error.',
        message: `BBox area exceeds set limit of ${limit}`,
      },
      bbox
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BboxAreaValidationError.prototype);
  }
}
