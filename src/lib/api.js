const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("scamshield_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}
