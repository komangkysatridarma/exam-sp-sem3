import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Beranda from "./pages/Beranda";
import Jelajah from "./pages/Jelajah";
import Favorit from "./pages/Favorit";
import Aktivitas from "./pages/Aktivitas";
import ArtikelDetail from "./pages/ArtikelDetail";
import AppHeader from "./components/AppHeader";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="site-main">{children}</div>
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <motion className="app-shell" style={{ padding: 24, textAlign: "center" }}>
        Memuat…
      </motion>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/beranda" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/beranda"
        element={
          <AppLayout>
            <Beranda />
          </AppLayout>
        }
      />
      <Route
        path="/jelajah"
        element={
          <AppLayout>
            <Jelajah />
          </AppLayout>
        }
      />
      <Route
        path="/favorit"
        element={
          <AppLayout>
            <Favorit />
          </AppLayout>
        }
      />
      <Route
        path="/aktivitas"
        element={
          <AppLayout>
            <Aktivitas />
          </AppLayout>
        }
      />
      <Route
        path="/artikel/:id"
        element={
          <AppLayout>
            <ArtikelDetail />
          </AppLayout>
        }
      />
      <Route path="*" element={<Navigate to="/beranda" replace />} />
    </Routes>
  );
}

function motion(props) {
  return <div {...props} />;
}
