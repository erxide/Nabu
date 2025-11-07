import {z, ZodError} from 'zod';

const EnvSchema = z.object({
    DB_HOST: z.string(),

    DB_PORT: z.coerce.number(),

    DB_USERNAME: z.string(),

    DB_PASSWORD: z.string()
})

export type EnvType = z.infer<typeof EnvSchema>;

const getTypeSafeEnv = (): EnvType => {
    try {
        const env: EnvType = EnvSchema.parse(process.env);
        console.log('✔ All environment variables value have a valid format');
        return env;
    } catch (err) {
        console.error('✖ Invalid environment variables detected:');
        const error = err as ZodError;
        console.error(z.treeifyError(error));
        process.exit(1);
    }
};

const env = getTypeSafeEnv();

export default env;