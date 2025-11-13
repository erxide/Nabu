import type { Users } from "../../type";
import ArangoDB from "../arango";

export const findUserByUsername = async (username: Users['username']):Promise<Users|null> => {
    const db = await ArangoDB.instance();

    const bindVars = { username }

    const cursor = await db.query(`
        FOR u IN Users
            FILTER u.username == @username
            RETURN u
        `, bindVars);

    return await cursor.next();
};
