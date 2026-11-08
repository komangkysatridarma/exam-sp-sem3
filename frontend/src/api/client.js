const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("hl_token");
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Permintaan gagal");
  }
  return data;
}

export const authApi = {
  register: (body) => api("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => api("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => api("/auth/me"),
};

export const contentApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/content${q ? `?${q}` : ""}`);
  },
  byId: (id) => api(`/content/${id}`),
  bySlug: (slug) => api(`/content/slug/${slug}`),
};

export const favoritesApi = {
  list: () => api("/favorites"),
  add: (id) => api(`/favorites/${id}`, { method: "POST" }),
  remove: (id) => api(`/favorites/${id}`, { method: "DELETE" }),
};

export const activitiesApi = {
  weekly: () => api("/activities/weekly"),
  weeklyPreview: () => api("/activities/preview/weekly"),
  list: () => api("/activities"),
  create: (body) => api("/activities", { method: "POST", body: JSON.stringify(body) }),
};
