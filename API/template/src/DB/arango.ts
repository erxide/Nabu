import { Database } from "arangojs";
import env from "../env"
import type { Cursor } from "arangojs/cursors";

export default class ArangoDB {
    static #instance: ArangoDB;

    private readonly protocol = 'http';
    private readonly host = env.DB_HOST || "127.0.0.1";
    private readonly port = env.DB_PORT || 8529;
    private readonly username = env.DB_USERNAME || "";
    private readonly password = env.DB_PASSWORD || ""; 
    private readonly name = 'Nabu';
    private readonly maxRetries = 5;

    private database!: Database;

    public static async instance(): Promise<ArangoDB> {
        if (!ArangoDB.#instance) {
            ArangoDB.#instance = new ArangoDB();
            await ArangoDB.#instance.connect();
        }
        return ArangoDB.#instance;
    }

    private async connect(): Promise<void> {
        this.database = new Database({
            url: `${this.protocol}://${this.host}:${this.port}`,
            databaseName: this.name,
            maxRetries: this.maxRetries,
            auth: {username: this.username, password: this.password},
            agentOptions:{
                keepAlive: true,
            }
        })

        try {
            await this.database.status();
        } catch (error) {
            throw new Error('Unable to connect to database :' + error);
        }

        console.log('Connected to ARANGO database');
    }

    public async query<T = any>(query: string, bindVars?:Record<string, any>): Promise<Cursor<T>> {
        const trace = new Error('Trace from ArangoService.query').stack;
        try {
            return await this.database.query<T>(query, bindVars);
        } catch (error: any) {
            if (error.syscall === 'socket') {
                await this.connect();
                return await this.query(query, bindVars)
            }
            error.query = query;
            error.trace = trace;
            throw error
        }
    }

    public async exists(): Promise<boolean> {
        return this.database.exists();
    }
}