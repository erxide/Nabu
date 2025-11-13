import { useEffect, useState } from "react";

export default function RegisterGoogle() {
    const [info, setInfo] = useState<any>(null);
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const tempId = new URLSearchParams(location.search).get("tempId") ?? "";

    useEffect(() => {
        if (!tempId) { setError('Lien invalide'); return; }
        fetch(`http://localhost:3000/auth/google/temp?tempId=${tempId}`)
            .then(r => r.json())
            .then(d => { setInfo(d); setUsername(d?.given_name || ""); })
            .catch(() => setError("Impossible de charger les infos"));
    }, [tempId]);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("http://localhost:3000/auth/google/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tempId, username })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            setError(err.error || "Erreur d'inscription");
            return;
        };
        const { token } = await res.json();
        localStorage.setItem("token", token);
        location.href = "/profile";
    };

    if (error) return <p>{error}</p>;
    if (!info) return <p> Chargement...</p>;

    return (
        <div style={{ maxWidth: 420, margin: "40px auto" }}>
            <h2>Bienvenue {info.given_name}</h2>
            <p>{info.email}</p>
            <form onSubmit={submit}>
                <label>Nom d'utilisateur : </label>
                <input type="text" placeholder={info.given_name} onChange={e => setUsername(e.target.value)} required/>
                <button type="submit">Continuer</button>
            </form>
        </div>
    );
};