import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";
import { favoritesApi, contentApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Pages.css";

export default function Favorit() {
  const { isAuthenticated, guest } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    if (isAuthenticated) {
      favoritesApi.list().then((r) => setItems(r.items));
      return;
    }
    contentApi.list().then((r) => {
      const demo = r.items.slice(0, 3);
      setItems(demo);
    });
  }, [isAuthenticated]);

  const filtered =
    filter === "semua"
      ? items
      : items.filter((i) => i.category === filter || (filter === "gerak" && i.category === "olahraga"));

  return (
    <main className="page">
        <h1 className="page-title">Favoritmu</h1>
        {guest && <p className="preview-note">Pratinjau setelah masuk — data contoh</p>}
        <div className="stats-card">
          <span className="stats-card__num">{filtered.length}</span>
          <span>artikel tersimpan</span>
        </div>
        <div className="chips">
          <button
            type="button"
            className={`chip${filter === "semua" ? " active" : ""}`}
            onClick={() => setFilter("semua")}
          >
            Semua — {items.length}
          </button>
          <button
            type="button"
            className={`chip${filter === "nutrisi" ? " active" : ""}`}
            onClick={() => setFilter("nutrisi")}
          >
            Nutrisi
          </button>
          <button
            type="button"
            className={`chip${filter === "gerak" ? " active" : ""}`}
            onClick={() => setFilter("gerak")}
          >
            Gerak aktif
          </button>
        </div>
        <div className="card-grid">
          {filtered.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </div>
        {!isAuthenticated && (
          <motion className="fav-cta">
            <p>Buat koleksi versimu sendiri</p>
            <Link to="/login" className="btn-primary btn-inline">
              Masuk untuk menyimpan favorit
            </Link>
          </motion>
        )}
    </main>
  );
}

function motion({ className, children }) {
  return <div className={className}>{children}</div>;
}
