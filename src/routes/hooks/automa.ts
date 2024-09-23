import { FastifyInstance } from 'fastify';
import { verifyWebhook } from '@automa/bot';

import { env } from '../../env';
import { logger, SeverityNumber } from '../../telemetry';

import { automa } from '../../clients';
import { update } from '../../update';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      task: {
        id: number;
        token: string;
        title: string;
      };
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

    const baseURL = request.headers['x-automa-server-host'] as string;

    // Download code
    const folder = await automa.code.download(request.body, {
      baseURL,
    });

    try {
      // Modify code
      await update(folder);

      // Propose code
      await automa.code.propose(
        {
          ...request.body,
          proposal: {
            message: env.COMMIT_MESSAGE,
          },
        },
        {
          baseURL,
        },
      );
    } finally {
      // Clean up
      automa.code.cleanup(request.body);
    }

    return reply.send();
  });
}
