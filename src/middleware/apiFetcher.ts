import { useAuth } from "../store/Auth";

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

async function refreshToken(): Promise<string> {
  const res = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("refresh failed");

  const data = await res.json();
  return data.access_token;
}

function processQueue(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

function addToQueue(): Promise<string> {
  return new Promise((resolve) => queue.push(resolve));
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const { token, setToken, logout } = useAuth.getState();

  const request = (t: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
    });

  // no token → logout
  if (!token) {
    logout();
    throw new Error("No token");
  }

  // 1st attempt
  let response = await request(token);

  // success → done
  if (response.status !== 401) return response;

  // refresh only once
  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const newToken = await refreshToken();

      setToken(newToken);
      processQueue(newToken);

      // retry ORIGINAL request with new token
      return await request(newToken);

    } catch (error) {
      console.error("❌ refreshToken failed:", error);

      queue = [];
      logout();

      throw new Error("auth failed");
    } finally {
      isRefreshing = false;
    }
  }

  // if refresh already happening → wait
  const newToken = await addToQueue();

  // IMPORTANT: retry request after refresh
  return await request(newToken);
}