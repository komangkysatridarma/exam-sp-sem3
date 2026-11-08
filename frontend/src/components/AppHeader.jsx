import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AppHeader.css";

const nav = [
  { to: "/beranda", label: "Beranda" },
  { to: "/jelajah", label: "Jelajah" },
  { to: "/favorit", label: "Favorit" },
  { to: "/aktivitas", label: "Aktivitas" },
];

export default function AppHeader() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/beranda" className="logo-row">
          <span className="logo-icon">🌿</span>
          HealthyLife
        </Link>
        <nav className="site-nav" aria-label="Menu utama">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `site-nav__link${isActive ? " active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="site-header__actions">
          {isAuthenticated ? (
            <>
              <span className="site-user">
                <span className="avatar">{user?.fullName?.charAt(0) || "U"}</span>
                <span className="site-user__name">{user?.fullName}</span>
              </span>
              <button type="button" className="btn-text" onClick={logout}>
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-text">
                Masuk
              </Link>
              <Link to="/register" className="btn-header">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
