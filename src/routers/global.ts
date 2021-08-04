import { Router } from 'express';
import { exportGeopackageRouter } from './exportGeopackage';
import { getExecutionStatusRouter } from './getGeopackageExecutionStatus';
import { swaggerRouter } from './swagger';
import { gmRoute } from './gmRoute';

const globalRouter = Router();
globalRouter.use(swaggerRouter);
globalRouter.use('/exportGeopackage', exportGeopackageRouter);
globalRouter.use('/exportStatus', getExecutionStatusRouter);
globalRouter.use('/getmap', gmRoute);

export { globalRouter };
