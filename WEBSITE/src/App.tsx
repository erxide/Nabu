import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AuthSuccess from './pages/authsuccess';
import RegisterGoogle from './pages/authGoogleRegister';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Vérifie si un token existe au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Barre de navigation */}
      <nav className="flex justify-between items-center bg-white px-6 py-3 shadow-sm mb-6">
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Accueil  </Link>|
          {!isLoggedIn && <Link to="/login" className="hover:underline">  Connexion </Link>}
          {isLoggedIn && <Link to="/profile" className="hover:underline">  Profil </Link>}
        </div>
      </nav>

      {/* Routes */}
      <main className="px-6">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-semibold">Bienvenue 👋</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth/register" element={<RegisterGoogle />} />
        </Routes>
      </main>
    </div>
  );
}
