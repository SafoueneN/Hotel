import { NavLink } from 'react-router-dom';
import { useAuth } from '../useAuth';

export default function Navbar() {
  const { authenticated, username, isAdmin, login, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">HotelBook</div>
      <nav className="navbar-links">
        <NavLink to="/" end>Hôtels</NavLink>
        {authenticated && <NavLink to="/reservations">Mes réservations</NavLink>}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="navbar-auth">
        {authenticated ? (
          <>
            <span className="navbar-user">
              {username} {isAdmin && <span className="badge badge-admin">ADMIN</span>}
            </span>
            <button className="btn btn-ghost" onClick={logout}>Déconnexion</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={login}>Se connecter</button>
        )}
      </div>
    </header>
  );
}
