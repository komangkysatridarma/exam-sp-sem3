import { Link } from "react-router-dom";
import "./ContentCard.css";

const categoryLabel = {
  nutrisi: "NUTRISI",
  olahraga: "GERAK AKTIF",
  istirahat: "ISTIRAHAT",
  artikel: "ARTIKEL",
  video: "VIDEO",
};

export default function ContentCard({ item, horizontal, featured, showSave, onSave, saved }) {
  const cat = categoryLabel[item.category] || item.category?.toUpperCase();
  const inner = (
    <>
      <img src={item.imageUrl} alt="" className="content-card__img" />
      <div className="content-card__body">
        <span className="content-card__cat">{cat}</span>
        <h3 className="content-card__title">{item.title}</h3>
        <p className="content-card__meta">
          {item.readMinutes ? `${item.readMinutes} menit baca` : item.durationLabel || ""}
        </p>
      </div>
      {showSave && (
        <button
          type="button"
          className="content-card__save"
          onClick={(e) => {
            e.preventDefault();
            onSave?.();
          }}
          aria-label="Simpan favorit"
        >
          {saved ? "★" : "☆"}
        </button>
      )}
    </>
  );

  if (horizontal) {
    return (
      <Link to={`/artikel/${item._id}`} className="content-card content-card--h">
        {inner}
      </Link>
    );
  }
  return (
    <Link
      to={`/artikel/${item._id}`}
      className={`content-card${featured ? " content-card--featured" : ""}`}
    >
      {inner}
    </Link>
  );
}
