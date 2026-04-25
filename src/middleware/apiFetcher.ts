let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

function getToken() {
  return localStorage.getItem("access_token");
}

function setToken(token: string) {
  localStorage.setItem("access_token", token);
}

function clearToken() {
  localStorage.removeItem("access_token");
}

async function refreshToken(): Promise<string> {
  const res = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  setToken(data.access_token);

  return data.access_token;
}

function resolveQueue(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

function addToQueue(): Promise<string> {
  return new Promise((resolve) => {
    queue.push(resolve);
  });
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const request = (token: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

  let token = getToken();

  if (!token) {
    clearToken();
    window.location.href = "/login";
    throw new Error("No token");
  }

  let response = await request(token);

  // ✔ success → return immediately
  if (response.status !== 401) return response;

  // first refresh only
  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const newToken = await refreshToken();
      resolveQueue(newToken);
    } catch (err) {
      queue = [];
      isRefreshing = false;
      throw err;
    }

    isRefreshing = false;
  }

  // wait for refreshed token
  const newToken = await addToQueue();

  // retry original request
  return request(newToken);
}