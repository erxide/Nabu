import { password } from "bun";
import type { Users } from "../../type";
import ArangoDB from "../arango";

export const registerUser = async (newUser: Users):Promise<Users> => {
    const db = await ArangoDB.instance();

    const bindVars = {username:newUser.username, password: newUser.hashedpassword}

    const cursor = await db.query(`
        INSERT { username: @username, password: @password}
        INTO Users
        RETURN NEW
    `, bindVars)

    const user:Users = await cursor.next();
    return user
};
