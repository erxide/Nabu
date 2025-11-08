import type { Context, Next } from "hono";
import { verifyJWT } from "../utils/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header('authorization');

    if (!authHeader) return c.json({error:'Token invalide'}, 401);

    const token = authHeader.split(' ')[1];
    if (!token) return c.json({error:'Token invalide'}, 401);

    const payload = await verifyJWT(token);

    if (!payload) return c.json({error:'Token invalide'}, 401);

    c.set('user', payload)

    await next();
};