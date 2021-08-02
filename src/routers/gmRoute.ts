import { Router } from 'express';
import { container } from 'tsyringe';
import { GMController } from '../controllers/gmController';

const gmRoute = Router();
const controller = container.resolve(GMController);

gmRoute.post(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  controller.start.bind(controller)
);

export { gmRoute };
