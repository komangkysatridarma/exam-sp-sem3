import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, exploreAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await authApi.login({ email, password });
      login(data.token, data.user);
      if (!remember) {
        /* token tetap di localStorage untuk demo; ingat saya untuk UX */
      }
      navigate("/beranda");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <motion className="auth-split">
        <motion className="auth-visual">
          <Link to="/beranda" className="logo-row">
            <span className="logo-icon">🌿</span>
            HealthyLife
          </Link>
          <img
            className="auth-visual__img"
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80"
            alt=""
          />
        </motion>
        <motion className="auth-panel">
      <h1 className="auth-title">Senang kamu kembali</h1>
      <p className="auth-sub">Masuk untuk melanjutkan favorit dan aktivitasmu.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span className="field-label">Alamat email</span>
          <input
            className="field-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <span className="field-label">Kata sandi</span>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Ingat saya
          </label>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Lupa kata sandi?</span>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary btn-inline" disabled={submitting}>
          Masuk
        </button>
      </form>
      <p className="auth-divider">atau</p>
      <button
        type="button"
        className="btn-secondary btn-inline"
        onClick={() => {
          exploreAsGuest();
          navigate("/beranda");
        }}
      >
        Jelajahi sebagai tamu
      </button>
      <p className="auth-footer">
        Belum punya akun? <Link to="/register">Daftar sekarang</Link>
      </p>
        </motion>
      </motion>
    </div>
  );
}

function motion({ className, children }) {
  return <div className={className}>{children}</div>;
}
