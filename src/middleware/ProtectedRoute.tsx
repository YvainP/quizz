import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "./apiFetcher";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/me");

        if (!res.ok) {
          localStorage.removeItem("access_token");
          setValid(false);
          return;
        }

        setValid(true);
      } catch {
        localStorage.removeItem("access_token");
        setValid(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!valid) return <Navigate to="/login" replace />;

  return children;
}