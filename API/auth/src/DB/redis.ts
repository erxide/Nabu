import Redis from 'ioredis';
import env from '../env';

export default class REDIS {
    static #instance: REDIS;

    private readonly host = env.REDIS_HOST;
    private readonly port = env.REDIS_PORT;
    private readonly password = env.REDIS_PASSWORD;

    private redis!: Redis;

    private async connect(): Promise<void> {
        this.redis = new Redis({
            host: this.host,
            port: this.port,
            password: this.password,
            lazyConnect: false,
            reconnectOnError: () => true
        });

        this.redis.on("connect", () => {
            console.log(`✔ Connected to Redis`);
        });

        this.redis.on("error", (err) => {
            console.error("Redis connection error:", err);
        });
    }

    public static async instance():Promise<REDIS> {
        if (!REDIS.#instance) {
            REDIS.#instance = new REDIS();
            await REDIS.#instance.connect();
        }
        return REDIS.#instance;
    };

    public async getClient(): Promise<Redis> {
        if (!this.redis || this.redis.status === 'end' || this.redis.status === 'wait') await this.connect();
        return this.redis
    }

    public static async client(): Promise<Redis> {
        return (await this.instance()).getClient();
    };
};