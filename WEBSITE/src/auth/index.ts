const AUTH_URL = "http://localhost:3000";

export const register = async (username: string, password: string) => {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de l'inscription");
    }

    return res.json();
}; 

export const login = async (username:string, password: string) => {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Identifiants invalides");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Pas de token");
    const res = await fetch(`${AUTH_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        localStorage.removeItem("token");
        throw new Error("Session expirée");
    }

    return res.json();
};