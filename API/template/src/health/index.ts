import { Hono } from 'hono';
import ArangoDB from '../DB/arango';

const app = new Hono();

app.get('', async (c) => {
    const db = await ArangoDB.instance();
    const exists = db.exists();

    if (!exists) {
        return c.json({
            bun: Bun.version,
            arango: false
        }, 503);
    }

    return c.json({
        bun: Bun.version,
        arango: true,
    }, 200);
});

export default app;