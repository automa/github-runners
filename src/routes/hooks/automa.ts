import { FastifyInstance } from 'fastify';
import { verifyWebhook, WebhookEventType, WebhookPayload } from '@automa/bot';
import { ATTR_HTTP_REQUEST_HEADER } from '@opentelemetry/semantic-conventions/incubating';

import { env } from '../../env';

import { automa } from '../../clients';
import { update } from '../../update';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: WebhookPayload;
  }>('/automa', async (request, reply) => {
    // Skip if not `task.created` event
    if (request.body.type !== WebhookEventType.TaskCreated) {
      return reply.code(204).send();
    }

    const id = request.headers['webhook-id'] as string;
    const signature = request.headers['webhook-signature'] as string;

    // Verify request
    if (!verifyWebhook(env.AUTOMA.WEBHOOK_SECRET, signature, request.body)) {
      app.log.warn(
        {
          'http.request.id': request.id,
          [ATTR_HTTP_REQUEST_HEADER('webhook-id')]: id,
          [ATTR_HTTP_REQUEST_HEADER('webhook-signature')]: signature,
        },
        'Invalid signature',
      );

      return reply.unauthorized();
    }

    app.log.info(
      {
        'http.request.id': request.id,
        [ATTR_HTTP_REQUEST_HEADER('webhook-id')]: id,
        [ATTR_HTTP_REQUEST_HEADER('webhook-signature')]: signature,
      },
      'Webhook verified',
    );

    const baseURL = request.headers['x-automa-server-host'] as string;

    // Download code
    const folder = await automa.code.download(request.body.data, { baseURL });

    try {
      // Modify code
      await update(app, folder.path);

      // Propose code
      await automa.code.propose(
        {
          ...request.body.data,
          proposal: {
            ...(env.COMMIT_MESSAGE && {
              title: env.COMMIT_MESSAGE,
            }),
          },
        },
        {
          baseURL,
        },
      );
    } finally {
      // Clean up
      automa.code.cleanup(request.body.data);
    }

    return reply.send();
  });
}
