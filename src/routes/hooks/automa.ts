import { FastifyInstance } from 'fastify';
import { verifyWebhook } from '@automa/bot';

import { env } from '../../env';
import { logger, SeverityNumber } from '../../telemetry';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      action: string;
    };
  }>('/automa', async (request, reply) => {
    // Verify request
    if (
      !verifyWebhook(
        env.AUTOMA.WEBHOOK_SECRET,
        request.headers['x-automa-signature'] as string,
        request.body,
      )
    ) {
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
