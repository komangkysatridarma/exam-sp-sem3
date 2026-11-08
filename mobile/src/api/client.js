import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || {};
const API_BASE = process.env.EXPO_PUBLIC_API_URL || extra.apiUrl || "http://localhost:5000/api";

async function getToken() {
  return AsyncStorage.getItem("hl_token");
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = await getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Permintaan gagal");
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
