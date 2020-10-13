import { Router } from 'express';
import { exportGeopackageRouter } from './exportGeopackage';
import { getStatusRouter } from './getGeopackageExecutionStatus';
import { swaggerRouter } from './swagger';

const globalRouter = Router();
globalRouter.use(swaggerRouter);
globalRouter.use('/exportGeopackage', exportGeopackageRouter);
globalRouter.use('/status', getStatusRouter);

export { globalRouter };
