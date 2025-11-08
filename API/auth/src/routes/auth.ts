import { Hono } from "hono";
import { checkUserExists } from "../DB/querys/checkUserExists";
import { hashPassword } from "../utils/hash";
import { registerUser } from "../DB/querys/registerUser";

export const authRoute = new Hono();

authRoute.post('/register', async (c) => {
    const { username, password } = await c.req.json();
    if (!username || !password) return c.json({error: 'username et mot de passe requis'}, 400);

    if (await checkUserExists(username)) return c.json({ error: 'Utilisateur déjà existant' }, 409);

    const hashedpassword = await hashPassword(password);

    const newUser = await registerUser({username, hashedpassword});

    if (!newUser) return c.json({error: 'une erreur est survenue lors de la creation'}, 500);

    return c.json({ message: 'Utilisateur créé avec succès', newUser }, 201)
});