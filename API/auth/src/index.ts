import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger'
import { cors } from "hono/cors";

// import { authRoute } from './routes/auth';
import { usersRoute } from './routes/users';
import { googleAuth } from './routes/googleAuth';
import health from './routes/health';

const app = new OpenAPIHono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3001", 
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.use(logger())

app.route('/health-check', health);

// app.route('/auth', authRoute);

app.route("/auth/google", googleAuth);

app.route('/users', usersRoute)

app.get('/', (c) => c.text('API Hono Auth'));

export default app;
