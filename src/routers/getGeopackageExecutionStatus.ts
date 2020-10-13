import { Router } from 'express';
import { container } from 'tsyringe';
import { GetStatusController } from '../controllers/getGeopackageExecutionStatus';

const getStatusRouter = Router();
const controller = container.resolve(GetStatusController);

getStatusRouter.get('/', controller.exportRequestHandler.bind(controller));

export { getStatusRouter };
