import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import type { Users } from "../type";
import { findUserByID } from "../DB/querys/findUserByID";

type AuthContext = {
    Variables: {
        user: Users
    }
}

export const usersRoute = new Hono<AuthContext>();

usersRoute.use('*', authMiddleware);

usersRoute.get('/me', async (c) => {
    const contextUser = c.get("user");
    const user = await findUserByID(contextUser._id)
    if (!user) return c.json({ error: "Utilisateur introuvable" }, 404);
    return c.json({ user });
});