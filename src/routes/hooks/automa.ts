import { FastifyInstance } from 'fastify';
import { verifyWebhook } from '@automa/bot';
import { ATTR_HTTP_REQUEST_HEADER } from '@opentelemetry/semantic-conventions/incubating';

import { env } from '../../env';

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
    const signature = request.headers['x-automa-signature'] as string;

    // Verify request
    if (!verifyWebhook(env.AUTOMA.WEBHOOK_SECRET, signature, request.body)) {
      app.log.warn('Invalid signature', {
        'http.request.id': request.id,
        [ATTR_HTTP_REQUEST_HEADER('x-automa-signature')]: signature,
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
      await update(app, folder);

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
