export type Users = {
    _id:string
    username:string,
    password:string,
    googleId:GoogleUser['id'],
    email: GoogleUser['email'];
    name: GoogleUser['name'];
    given_name: GoogleUser['given_name'];
    family_name: GoogleUser['family_name'];
    picture: GoogleUser['picture'];
};

export type NewUser = Omit<Users, '_id' | '_key' | '_rev'>;

export type GoogleUser = {
    id: string;
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
};