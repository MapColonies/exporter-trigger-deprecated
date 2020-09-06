import { Router } from 'express';
import { exportGeopackageRouter } from './exportGeopackage';
import { swaggerRouter } from './swagger';

const globalRouter = Router();
globalRouter.use(swaggerRouter);
globalRouter.use('/exportGeopackage', exportGeopackageRouter);

export { globalRouter };
