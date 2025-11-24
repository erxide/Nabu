import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger'

import health from './routes/health';
import { authRoute } from './routes/auth';

const app = new OpenAPIHono();

app.use(logger())

app.route('/health-check', health);

app.route('/auth', authRoute);

app.get('/', (c) => c.text('API Hono Auth OK 🔐'));

export default app;
