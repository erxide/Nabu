import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import env from '../env';

const secret = new TextEncoder().encode(env.JWT_TOKEN);

export const signJWT = async (payload: JWTPayload):Promise<string> => {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setExpirationTime('2h')
        .sign(secret)
};

export const verifyJWT = async (token: string):Promise<JWTPayload|null> => {
    try {
        const {payload} = await jwtVerify(token, secret)
        return payload
    } catch (e) {
        return null
    };
};