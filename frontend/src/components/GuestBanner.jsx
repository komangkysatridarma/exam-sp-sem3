import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestBanner({ message }) {
  const { guest } = useAuth();
  if (!guest) return null;
  return (
    <div className="guest-banner">
      <span>{message || "Kamu menjelajah sebagai tamu. Masuk agar data tersimpan."}</span>
      <Link to="/login">Masuk</Link>
    </div>
  );
}
