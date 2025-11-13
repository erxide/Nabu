import { Hono } from "hono";
import env from "../env";
import { findUserByGoogleID } from "../DB/querys/findUserByGoogleID";
import { registerGoogleUser } from "../DB/querys/registerGoogleUser";
import { signJWT } from "../utils/jwt";
import type { GoogleUser } from "../type";

export const googleAuth = new Hono();

const CLIENT_ID = env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL = "http://localhost:3001";
const JWT_TOKEN = env.JWT_TOKEN;

googleAuth.get('/login', (c) => {
    
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });

    return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

googleAuth.get('/callback', async (c) => {
    const code = c.req.query("code")
    if (!code) return c.json({error : "Code manquant"}, 400);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        }),
    });

    const tokenData = await tokenRes.json() as { access_token: string };
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userInfoRes.json() as GoogleUser;
    let user = await findUserByGoogleID(userInfo.id);
    if (!user) {
        return c.redirect(`${FRONTEND_URL}/auth/register?googleId=${userInfo.id}&email=${userInfo.email}&name=${userInfo.name}&given_name=${userInfo.given_name}&family_name=${userInfo.family_name}&picture=${userInfo.picture}`);   
    }
    const token = await signJWT({_id: user._id, username: user.username});
    return c.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
});