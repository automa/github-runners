import process from 'node:process';

import { api, logs, NodeSDK, resources } from '@opentelemetry/sdk-node';
import {
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { logs as logsAPI } from '@opentelemetry/api-logs';

import {
  environment,
  isProduction,
  isTest,
  product,
  service,
  version,
} from './env';

export { SeverityNumber } from '@opentelemetry/api-logs';

const {
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} = logs;

const sdk = new NodeSDK({
  resource: new resources.Resource({
    [SEMRESATTRS_SERVICE_NAMESPACE]: product,
    [SEMRESATTRS_SERVICE_NAME]: service,
    [SEMRESATTRS_SERVICE_VERSION]: version,
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: environment,
  }),
  logRecordProcessor: !isTest
    ? isProduction
      ? new BatchLogRecordProcessor(new ConsoleLogRecordExporter())
      : new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
    : undefined,
});

sdk.start();

export const tracer = api.trace.getTracer('default');

export const logger = logsAPI.getLogger('default');

export const meter = api.metrics.getMeter('default');

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(
      () => console.log('Telemetry shut down successfully'),
      () => console.log('Telemetry shut down failed'),
    )
    .finally(() => {
      process.exit(0);
    });
});
