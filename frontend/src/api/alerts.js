const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_URL = `${API_BASE.replace(/\/$/, "")}/alerts`;

export const fetchAlerts = async (token) => {
  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
  });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return await res.json();
};
