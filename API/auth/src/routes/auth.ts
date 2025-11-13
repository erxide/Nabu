import { Hono } from "hono";
import { findUserByUsername } from "../DB/querys/findUserByUsername";
import { comparePassword, hashPassword } from "../utils/hash";
import { registerUser } from "../DB/querys/registerUser";
import { signJWT } from "../utils/jwt";

export const authRoute = new Hono();

authRoute.post('/register', async (c) => {
    const { username, password } = await c.req.json();
    if (!username || !password) return c.json({error: 'username et mot de passe requis'}, 400);

    if (await findUserByUsername(username)) return c.json({ error: 'Utilisateur déjà existant' }, 409);

    const hashedpassword = await hashPassword(password);

    const newUser = await registerUser({
        username, password,
        googleId: "",
        email: "",
        name: "",
        given_name: "",
        family_name: "",
        picture: ""
    });

    if (!newUser) return c.json({error: 'une erreur est survenue lors de la creation'}, 500);

    return c.json({ message: 'Utilisateur créé avec succès', newUser }, 201)
});

authRoute.post('/login', async (c) => {
    const {username, password} = await c.req.json()
    const user = await findUserByUsername(username);
    if (!user) return c.json({error:"Utilisateur non trouvé"}, 404);

    if (!user.password) return c.json({ error: 'Mot de passe incorrect' }, 401);
    
    const valid = await comparePassword(password, user.password);
    if (!valid) return c.json({ error: 'Mot de passe incorrect' }, 401);

    const token = await signJWT({ _id: user._id, username: user.username })
    return c.json({ token })
});