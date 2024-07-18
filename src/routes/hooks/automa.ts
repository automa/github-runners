import { FastifyInstance } from 'fastify';

import { logger, SeverityNumber } from '../../telemetry';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      action: string;
    };
  }>('/automa', async (request, reply) => {
    // Verify request
    if (!request.headers['x-automa-signature']) {
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'Invalid signature',
      });

      return reply.unauthorized();
    }

    // TODO: Process event

    reply.status(200).send();
  });
}
