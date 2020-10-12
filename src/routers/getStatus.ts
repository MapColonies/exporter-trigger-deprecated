import { Router } from 'express';
import { container } from 'tsyringe';
import { GetStatusController } from '../controllers/getStatus';

const getStatusRouter = Router();
const controller = container.resolve(GetStatusController);

getStatusRouter.get('/', controller.exportRequestHandler.bind(controller));

export { getStatusRouter };