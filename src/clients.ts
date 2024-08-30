import Automa from '@automa/bot';

import { env } from './env';

export const automa = new Automa({
  baseURL: env.AUTOMA.BASE_URL,
});
