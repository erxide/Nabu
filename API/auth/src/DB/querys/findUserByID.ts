import type { Users } from "../../type";
import ArangoDB from "../arango";

export const findUserByID = async (_id: Users['_id']):Promise<Users|null> => {
    const db = await ArangoDB.instance();

    const bindVars = { _id }

    const cursor = await db.query(`
        FOR u IN Users
            FILTER u._id == @_id
            RETURN u
        `, bindVars);

    return await cursor.next();
};
