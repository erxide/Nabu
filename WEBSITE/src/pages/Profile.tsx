import { getCurrentUser } from "@/auth";
import { useEffect, useState } from "react";

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getCurrentUser()
            .then((data) => setUser(data.user))
            .catch((err) => setError(err.message));
    }, []);


    if (error) return <p>{error}</p>
    if (!user) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Profil</h2>
            <p>Username: {user.username}</p>
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login'
                }}
            >
                Logout
            </button>
        </div>
    );
}