import { NavLink } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { IconBed, IconLogOut } from './icons';

export default function Navbar() {
  const { authenticated, username, isAdmin, login, logout } = useAuth();
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand" end>
        <IconBed />
        HotelBook
      </NavLink>
      <nav className="navbar-links">
        <NavLink to="/" end>Hôtels</NavLink>
        {authenticated && <NavLink to="/reservations">Mes réservations</NavLink>}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="navbar-auth">
        {authenticated ? (
          <>
            <span className="navbar-user">
              <span className="avatar">{initial}</span>
              {username} {isAdmin && <span className="badge badge-admin">ADMIN</span>}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              <IconLogOut /> Déconnexion
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={login}>Se connecter</button>
        )}
      </div>
    </header>
  );
}
