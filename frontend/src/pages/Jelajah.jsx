import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GuestBanner from "../components/GuestBanner";
import ContentCard from "../components/ContentCard";
import { contentApi } from "../api/client";
import "./Pages.css";

const chips = [
  { key: "semua", label: "Semua" },
  { key: "artikel", label: "Artikel" },
  { key: "video", label: "Video" },
  { key: "olahraga", label: "Olahraga" },
  { key: "nutrisi", label: "Nutrisi" },
];

export default function Jelajah() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "semua";
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      contentApi.list({ category, q: q || undefined }).then((r) => setItems(r.items));
    }, 200);
    return () => clearTimeout(timer);
  }, [category, q]);

  const articles = items.filter((i) => i.category === "artikel" || i.category === "istirahat" || i.type === "article");
  const videos = items.filter((i) => i.category === "video");
  const guides = items.filter((i) => i.category === "olahraga");
  const nutrition = items.filter((i) => i.category === "nutrisi");

  return (
    <main className="page">
        <h1 className="page-title">Jelajah</h1>
        <p className="page-sub">Pengetahuan baik, kebiasaan lebih baik.</p>
        <input
          className="field-input search-input search-input--wide"
          placeholder="Cari topik, artikel, atau panduan"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="chips">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`chip${category === c.key ? " active" : ""}`}
              onClick={() => setParams({ category: c.key })}
            >
              {c.label}
            </button>
          ))}
        </div>
        {articles.length > 0 && (
          <>
            <h2 className="section-title">Artikel pilihan</h2>
            <div className="card-grid">
              {articles.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
        {videos.length > 0 && (
          <>
            <h2 className="section-title">Video edukasi</h2>
            <div className="card-grid card-grid--2">
              {videos.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
        {guides.length > 0 && (
          <>
            <h2 className="section-title">Panduan olahraga</h2>
            <div className="card-grid">
              {guides.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
        {nutrition.length > 0 && (
          <>
            <h2 className="section-title">Informasi nutrisi</h2>
            <div className="card-grid">
              {nutrition.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
        <GuestBanner message="Kamu menjelajah sebagai tamu. Masuk untuk menyimpan favorit." />
    </main>
  );
}
