import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { login, exploreAsGuest } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.agree) {
      setError("Setujui syarat penggunaan terlebih dahulu");
      return;
    }
    setSubmitting(true);
    try {
      const data = await authApi.register(form);
      login(data.token, data.user);
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
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8ecc8?w=1200&q=80"
            alt=""
          />
          <span className="auth-hero-badge">LANGKAH KECIL, HIDUP LEBIH BAIK</span>
        </motion>
        <motion className="auth-panel">
      <h1 className="auth-title">Mulai kebiasaan baikmu</h1>
      <p className="auth-sub">Buat akun untuk menyimpan favorit dan mencatat aktivitas.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span className="field-label">Nama lengkap</span>
          <input
            className="field-input"
            placeholder="Nama yang ingin ditampilkan"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </label>
        <label>
          <span className="field-label">Alamat email</span>
          <input
            className="field-input"
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          <span className="field-label">Kata sandi</span>
          <input
            className="field-input"
            type="password"
            placeholder="Buat kata sandi"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={8}
            required
          />
          <p className="password-hint">Gunakan minimal 8 karakter.</p>
        </label>
        <label>
          <span className="field-label">Konfirmasi kata sandi</span>
          <input
            className="field-input"
            type="password"
            placeholder="Ulangi kata sandi"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
        </label>
        <label className="auth-check">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
          />
          <span>Saya menyetujui syarat penggunaan dan kebijakan privasi HealthyLife.</span>
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary btn-inline" disabled={submitting}>
          Buat akun
        </button>
      </form>
      <p className="auth-footer">
        Sudah punya akun? <Link to="/login">Masuk</Link>
      </p>
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
        </motion>
      </motion>
    </div>
  );
}

function motion({ className, children }) {
  return <div className={className}>{children}</div>;
}
