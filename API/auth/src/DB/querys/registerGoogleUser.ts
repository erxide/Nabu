import type { NewUser, Users } from "../../type";
import ArangoDB from "../arango";

export const registerGoogleUser = async (user: NewUser):Promise<Users> => {
    const db = await ArangoDB.instance();

    const bindVars = {user}

    const cursor = await db.query(`
        INSERT @user
        INTO Users
        RETURN NEW
    `, bindVars)

    const newUser:Users = await cursor.next();
    return newUser
};
