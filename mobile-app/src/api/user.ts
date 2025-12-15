import { API_BASE } from "../constants/api";
import { getToken } from "../utils/auth";

export async function fetchMe() {
  const token = await getToken();

  const res = await fetch(`${API_BASE}/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}
