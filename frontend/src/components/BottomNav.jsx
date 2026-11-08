import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const tabs = [
  { to: "/beranda", label: "Beranda", icon: "⌂" },
  { to: "/jelajah", label: "Jelajah", icon: "◎" },
  { to: "/favorit", label: "Favorit", icon: "♡" },
  { to: "/aktivitas", label: "Aktivitas", icon: "▣" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) => `bottom-nav__item${isActive ? " active" : ""}`}
        >
          <span className="bottom-nav__icon">{t.icon}</span>
          <span className="bottom-nav__label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
