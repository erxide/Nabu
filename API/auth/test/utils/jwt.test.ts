import { describe, it, expect } from "bun:test"
import { signJWT, verifyJWT } from "../../src/utils/jwt";

process.env.JWT_TOKEN = 'supersecret'

describe("JWT", async () => {
    it("signJWT doit creer un token valide", async () => {
        const payload = {userId:"123", role: "admin"};
        const token = await signJWT(payload);

        expect(token).toBeString();
        expect(token.split(".")).toHaveLength(3);
    });

    it("verifyJWT doit retourner la payload originale pour un token valide", async () => {
        const payload = {userId:"123", role: "admin"};
        const token = await signJWT(payload);
        const decoded = await verifyJWT(token);

        expect(decoded).not.toBeNull()
        expect(decoded?.userId).toBe(payload.userId)
        expect(decoded?.role).toBe(payload.role)
    });

    it("verifyJWT doit retourner null pour un token invalide", async () => {
        const invalidToken = "fake.JWT.token";
        const result = await verifyJWT(invalidToken);
        
        expect(result).toBeNull();
    });

    it("verifyJWT doit retourner null pour un token expiré", async () => {
        const {SignJWT} = await import('jose');
        const secret = new TextEncoder().encode(process.env.JWT_TOKEN);
        const token = await new SignJWT({foo:"bar"})
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1s")
            .sign(secret);
        
        await new Promise(r => setTimeout(r, 2000));

        const result = await verifyJWT(token);
        expect(result).toBeNull();
    }); 
});