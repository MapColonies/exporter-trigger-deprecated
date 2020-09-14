import { Router } from 'express';
import { container } from 'tsyringe';
import { validate } from 'openapi-validator-middleware';
import { ExportGeopackageController } from '../controllers/exportGeopackage';

const exportGeopackageRouter = Router();
const controller = container.resolve(ExportGeopackageController);

exportGeopackageRouter.post('/', validate, controller.post.bind(controller));

export { exportGeopackageRouter };
