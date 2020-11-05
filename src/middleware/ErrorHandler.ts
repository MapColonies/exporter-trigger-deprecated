import { MCLogger } from '@map-colonies/mc-logger';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { injectable } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { InputValidationError } from 'openapi-validator-middleware';
import { HttpError } from '../requests/errors/errors';

@injectable()
export class ErrorHandler {
  public constructor(private readonly logger: MCLogger) {}

  public getErrorHandlerMiddleware(): ErrorRequestHandler {
    return (
      err: Error,
      req: Request,
      res: Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: NextFunction
    ): void => {
      this.logger.error(
        `${req.method} request to ${
          req.originalUrl
        } has failed with error: ${JSON.stringify(err)}, and message: '${
          err.message
        }'`
      );

      if (err instanceof InputValidationError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          statusCode: StatusCodes.BAD_REQUEST,
          message: {
            validationErrors: err.errors,
          },
        });
      } else if (err instanceof HttpError) {
        res.status(err.status).json(err.name);
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(`Error: ${err.name}`);
      }
    };
  }
}
