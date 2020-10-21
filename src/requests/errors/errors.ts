import HttpStatus from 'http-status-codes';

export class HttpError extends Error {
  public constructor(public status: number, error: Error) {
    super(error.message);
    this.name = error.name;
    this.stack = error.stack;

    // Issue: https://github.com/microsoft/TypeScript/issues/10166
    // Reference: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  public toString = (): string => {
    const stackString = this.stack ? ` Stack=${this.stack}` : '';
    return `${this.message}.${stackString}`;
  };
}

export class BadRequestError extends HttpError {
  public constructor(error: Error) {
    super(HttpStatus.BAD_REQUEST, error);
  }
}

export class InternalServerError extends HttpError {
  public constructor(error: Error) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
}
