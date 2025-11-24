import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger'

import health from './health';

const app = new OpenAPIHono();

app.use(logger())

app.route('/health-check', health);

export default app;
