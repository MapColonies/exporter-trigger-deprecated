import { Router } from 'express';
import { container } from 'tsyringe';
import { validate } from 'openapi-validator-middleware';
import { GMController } from '../controllers/gmController';

const gmRoute = Router();
const controller = container.resolve(GMController);

gmRoute.post(
  '/',
  validate,
  controller.start.bind(controller)
);

export { gmRoute };
