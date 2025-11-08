import { describe, it, expect } from 'bun:test'
import { hashPassword, comparePassword } from '../../src/utils/hash'

describe('HASH', () => {
    it("hashPassword doit renvoyer un hash différent du mot de passe original", async () => {
        const password = "monsupermotdepass123";
        const hash = await hashPassword(password);

        expect(hash).toBeString();
        expect(hash).not.toBe(password);
        expect(hash.length).toBeGreaterThan(20);
    });

    it("comparePassword doit retourner true si le mot de passe correspond", async () => {
        const password = "monsupermotdepass123";
        const hash = await hashPassword(password);
        const isMatch = await comparePassword(password, hash);

        expect(isMatch).toBeTrue();
    });

    it("comparePassword doit retourner false si le mot de passe ne correspond pas", async () => {
        const password = "monsupermotdepass123";
        const hash = await hashPassword(password);
        const isMatch = await comparePassword("testFakeMdp", hash);

        expect(isMatch).toBeFalse();
    });
});