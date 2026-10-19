export const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://127.0.0.1:3001";
export function getUserId(): string | null { try { return localStorage.getItem("islearning_user_id"); } catch { return null; } }
export function setUserId(id: string | null) { try { if (id) localStorage.setItem("islearning_user_id", id); else localStorage.removeItem("islearning_user_id"); } catch {} }
export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const id = getUserId(); if (id) headers.set("x-user-id", id);
  let response: Response;
  try { response = await fetch(`${API_BASE}${path}`, { ...options, headers }); }
  catch { throw new Error("Cannot connect to ISLearning server. Start the backend and try again."); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
  return payload as T;
}

export async function apiBlob(path: string): Promise<Blob> {
  const headers = new Headers();
  const id = getUserId(); if (id) headers.set("x-user-id", id);
  let response: Response;
  try { response = await fetch(`${API_BASE}${path}`, { headers }); }
  catch { throw new Error("Cannot connect to ISLearning server. Start the backend and try again."); }
  if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(payload.message || `Request failed (${response.status})`); }
  return response.blob();
}
