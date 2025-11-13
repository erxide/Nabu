import { login } from "@/auth";
import { useState } from "react";

export default function Login() {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [error, setError] = useState("");

    // async function handleLogin(e: React.FormEvent) {
    //     e.preventDefault();
    //     try {
    //         await login(username, password);
    //         alert('Connexion réussie !');
    //         window.location.href = "/profile";
    //     } catch (err: any) {
    //         setError(err.message);
    //     }
    // }

    return (
        <div>
            <h2>Connexion</h2>
            {/* <form onSubmit={handleLogin}>
                <h2>Connexion</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">login</button>
                {error && <p style={{color:"red"}}>{error}</p>}
            </form> */}
            <br />
            <button onClick={() => window.location.href = "http://localhost:3000/auth/google/login"}>
                GOOGLE
            </button>
        </div>
    )
};