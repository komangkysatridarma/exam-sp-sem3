import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { activitiesApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Pages.css";

const activityTypes = [
  { value: "jalan_kaki", label: "Jalan kaki" },
  { value: "peregangan", label: "Peregangan" },
  { value: "lari", label: "Lari" },
  { value: "bersepeda", label: "Bersepeda" },
];

export default function Aktivitas() {
  const { isAuthenticated } = useAuth();
  const [weekly, setWeekly] = useState({ totalMinutes: 0, days: [] });
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    type: "jalan_kaki",
    date: new Date().toISOString().slice(0, 10),
    durationMinutes: 20,
    notes: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      activitiesApi.weekly().then(setWeekly);
      activitiesApi.list().then((r) => setHistory(r.items));
    } else {
      activitiesApi.weeklyPreview().then((p) => {
        setPreview(p);
        setWeekly({ totalMinutes: p.totalMinutes, days: p.days });
      });
    }
  }, [isAuthenticated]);

  async function saveActivity(e) {
    e.preventDefault();
    if (!isAuthenticated) return;
    setMsg("");
    try {
      await activitiesApi.create(form);
      setMsg("Aktivitas tersimpan");
      const w = await activitiesApi.weekly();
      setWeekly(w);
      const list = await activitiesApi.list();
      setHistory(list.items);
      setForm({ ...form, notes: "" });
    } catch (err) {
      setMsg(err.message);
    }
  }

  const maxBar = Math.max(...weekly.days.map((d) => d.minutes), 1);

  return (
    <main className="page">
      <h1 className="page-title">Aktivitasmu</h1>
      <div className="aktivitas-layout">
        <motion className="aktivitas-col">
        <div className="chart-card">
          <span className="chart-card__label">Minggu ini</span>
          <strong className="chart-card__total">{weekly.totalMinutes} menit bergerak</strong>
          <div className="bar-chart">
            {weekly.days.map((d, i) => (
              <div key={i} className="bar-col">
                <div
                  className="bar-fill"
                  style={{ height: `${Math.max(8, (d.minutes / maxBar) * 72)}px` }}
                />
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="section-title">Catat aktivitas</h2>
        <form className="activity-form" onSubmit={saveActivity}>
          <label>
            <span className="field-label">Jenis aktivitas</span>
            <select
              className="field-input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {activityTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <div className="form-row-2">
            <label>
              <span className="field-label">Tanggal</span>
              <input
                type="date"
                className="field-input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
            <label>
              <span className="field-label">Durasi (menit)</span>
              <input
                type="number"
                min={1}
                className="field-input"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              />
            </label>
          </div>
          <label>
            <span className="field-label">Catatan</span>
            <textarea
              className="field-input"
              rows={3}
              placeholder="Contoh: Jalan santai di kompleks"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          {isAuthenticated ? (
            <button type="submit" className="btn-primary btn-inline">
              Simpan aktivitas
            </button>
          ) : (
            <Link to="/login" className="btn-primary btn-inline">
              🔒 Masuk untuk menyimpan
            </Link>
          )}
          {msg && <p className="error-text" style={{ color: "var(--green-800)" }}>{msg}</p>}
        </form>
        </motion>

        <motion className="aktivitas-col">
        <h2 className="section-title">Riwayat aktivitas</h2>
        {!isAuthenticated && preview?.sampleHistory?.map((group) => (
          <div key={group.date} className="history-group">
            <h3>{group.date}</h3>
            {group.items.map((item, idx) => (
              <div key={idx} className="history-item">
                <div>
                  <strong>{item.typeLabel}</strong>
                  <p className="history-meta">{item.timeLabel}</p>
                </div>
                <span>{item.durationMinutes} mnt</span>
              </div>
            ))}
          </div>
        ))}
        {isAuthenticated &&
          history.map((a) => (
            <div key={a._id} className="history-item">
              <div>
                <strong>{a.typeLabel}</strong>
                <p className="history-meta">
                  {new Date(a.date).toLocaleDateString("id-ID")} • {a.intensity}
                </p>
              </div>
              <span>{a.durationMinutes} mnt</span>
            </div>
          ))}
        </motion>
      </div>
    </main>
  );
}

function motion({ className, children }) {
  return <div className={className}>{children}</div>;
}
