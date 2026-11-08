import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { contentApi, favoritesApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Pages.css";

export default function ArtikelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, guest } = useAuth();
  const [item, setItem] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    contentApi.byId(id).then((r) => setItem(r.item));
    if (isAuthenticated) {
      favoritesApi.list().then((r) => {
        setSaved(r.items.some((f) => f._id === id));
      });
    }
  }, [id, isAuthenticated]);

  async function toggleSave() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (saved) {
      await favoritesApi.remove(id);
      setSaved(false);
    } else {
      await favoritesApi.add(id);
      setSaved(true);
    }
  }

  if (!item) return <motion className="page">Memuat artikel…</motion>;

  const paragraphs = (item.body || item.excerpt || "").split("\n\n");

  return (
    <article className="article-layout">
      <div className="article-toolbar">
        <button type="button" className="icon-btn" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
        <span className="article-toolbar__label">Artikel</span>
      </div>
      <div className="article-body detail-page">
        <img src={item.imageUrl} alt="" className="detail-hero" />
        <p className="detail-meta">
          {(item.category || "").toUpperCase()} • {item.readMinutes} menit baca
        </p>
        <h1 className="detail-title">{item.title}</h1>
        <p className="detail-author">
          {item.author} · {new Date(item.publishedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {item.rememberBox && (
          <motion className="remember-box">
            <strong>Yang perlu kamu ingat</strong>
            <p>{item.rememberBox}</p>
          </motion>
        )}
        {paragraphs.map((p, i) => (
          <p key={i} className="detail-p">
            {p}
          </p>
        ))}
        {item.references?.length > 0 && (
          <motion className="ref-box">
            <strong>Rujukan</strong>
            <ul>
              {item.references.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </motion>
        )}
        <motion className="article-actions">
          {guest || !isAuthenticated ? (
            <Link to="/login" className="btn-primary btn-inline">
              🔖 Masuk untuk menyimpan
            </Link>
          ) : (
            <button type="button" className="btn-primary btn-inline" onClick={toggleSave}>
              {saved ? "★ Tersimpan di favorit" : "☆ Simpan ke favorit"}
            </button>
          )}
        </motion>
      </div>
    </article>
  );
}

function motion(props) {
  return <div {...props} />;
}
