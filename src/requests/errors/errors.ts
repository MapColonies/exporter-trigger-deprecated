import HttpStatus from 'http-status-codes';

export class HttpError extends Error {
  public constructor(public status: number, error: Error) {
    super(error.message);
    this.name = error.name;
    this.stack = error.stack;
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
