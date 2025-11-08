import type { Users } from "../../type";
import ArangoDB from "../arango";

export const checkUserExists = async (username: Users['username']):Promise<boolean> => {
    const db = await ArangoDB.instance();

    const bindVars = { username }

    const cursor = await db.query(`
        FOR u IN Users
            FILTER u.username == @username
            RETURN u
        `, bindVars);

    const result = await cursor.next();
    return !!result;
};
