import type { Users } from "../../type";
import ArangoDB from "../arango";

export const findUserByGoogleID = async (googleId: Users['googleId']):Promise<Users> => {
    const db = await ArangoDB.instance();

    const bindVars = { googleId }

    const cursor = await db.query(`
        FOR u IN Users
            FILTER u.googleId == @googleId
            RETURN u
        `, bindVars);

    return await cursor.next();
};
