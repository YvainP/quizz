import { Navigate } from "react-router-dom";
import { useAuth } from "../store/Auth";

export default function LoggedChecker({ children }: { children: React.ReactNode }) {
  const token = useAuth((state) => state.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}