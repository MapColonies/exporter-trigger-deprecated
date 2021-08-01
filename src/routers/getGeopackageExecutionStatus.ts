import { Router } from 'express';
import { container } from 'tsyringe';
import { GetExecutionStatusController } from '../controllers/getGeopackageExecutionStatus';

const getExecutionStatusRouter = Router();
const controller = container.resolve(GetExecutionStatusController);

getExecutionStatusRouter.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  controller.exportStatusRequestHandler.bind(controller)
);

export { getExecutionStatusRouter };
