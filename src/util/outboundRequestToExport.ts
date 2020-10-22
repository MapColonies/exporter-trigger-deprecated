import { IInboundRequest, IOutboundRequest } from '../model/exportRequest';
import { BadRequestError } from '../requests/errors/errors';

export default function (taskId: string, request: IInboundRequest): string {
  try {
    const parsedMessage: IOutboundRequest = {
      taskId,
      fileName: request.fileName,
      url: request.exportedLayers[0].url,
      bbox: request.bbox,
    };

    return JSON.stringify(parsedMessage);
  } catch (error) {
    throw new BadRequestError(error);
  }
}
