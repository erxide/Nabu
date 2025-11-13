import { Hono } from "hono";
import env from "../env";
import REDIS from "../DB/redis";
import type { GoogleUser } from "../type";
import { findUserByGoogleID } from "../DB/querys/findUserByGoogleID";
import { signJWT } from "../utils/jwt";
import { registerGoogleUser } from "../DB/querys/registerGoogleUser";

const FRONTEND_URL = "http://localhost:3001";
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = env.GOOGLE_REDIRECT_URI;

export const googleAuth = new Hono();

googleAuth.get('/login', async (c) => {
    const redis = await REDIS.client();
    const state = crypto.randomUUID();
    await redis.setex(`oauth:state:${state}`, 300, "google");

    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        state
    })

    return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

googleAuth.get('/callback', async (c) => {
    const error = c.req.query("error");
    if (error === "access_denied") {
        console.warn("Utilisateur a annulé la connexion Google.");
        return c.redirect(`${FRONTEND_URL}/login`);
    }
    const redis = await REDIS.client();
    const code = c.req.query("code");
    const state = c.req.query("state");
    if (!code || !state) return c.json({ error: "Code ou state manquant" }, 400);

    const ok = await redis.get(`oauth:state:${state}`);
    if (!ok) return c.json({ error: "State invalide ou expiré" }, 400);
    await redis.del(`oauth:state:${state}`);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        }),
    });

    if (!tokenRes.ok) return c.json({ error: "Échec échange token" }, 400);
    const tokenData = await tokenRes.json() as { access_token: string };

    const uiRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}`}
    });
    if (!uiRes.ok) return c.json({ error: "Échec userinfo" }, 400);

    const userInfo = await uiRes.json() as GoogleUser;

    const existing = await findUserByGoogleID(userInfo.id);
    if (existing) {
        const token = await signJWT(existing);
        return c.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
    };

    const tempId = crypto.randomUUID();
    await redis.setex(
        `oauth:google:temp:${tempId}`,
        300,
        JSON.stringify({
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            given_name: userInfo.given_name,
            family_name: userInfo.family_name,
            picture: userInfo.picture
        })
    );

    return c.redirect(`${FRONTEND_URL}/auth/register?tempId=${tempId}`);
});

googleAuth.get('/temp', async (c) => {
    const redis = await REDIS.client();
    const tempId = c.req.query("tempId");
    if (!tempId) return c.json({ error: "tempId manquant" }, 400);

    const raw = await redis.get(`oauth:google:temp:${tempId}`);
    if (!raw) return c.json({ error: "Session expirée ou invalide" }, 404);

    const data:GoogleUser = JSON.parse(raw);
    return c.json({
        name: data.name,
        given_name: data.given_name,
        family_name: data.family_name,
        email: data.email
    });
});

googleAuth.post('/register', async (c) => {
    const redis = await REDIS.client();
    const { tempId, username} = await c.req.json();
    if (!tempId || !username) return c.json({ error: "Données manquantes" }, 400);

    const raw = await redis.get(`oauth:google:temp:${tempId}`);
    if (!raw) return c.json({ error: "Session expirée" }, 400);

    const data = JSON.parse(raw) as GoogleUser;

    const user = await registerGoogleUser({
        username,
        password: "",
        googleId: data.id,
        email: data.email,
        name: data.name,
        given_name: data.given_name,
        family_name: data.family_name,
        picture: data.picture
    });

    await redis.del(`oauth:google:temp:${tempId}`);

    const token = await signJWT(user);
    return c.json({token})
});