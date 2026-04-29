import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

import AuthChecker from "./middleware/AuthChecker";
import LoggedChecker from "./middleware/LoggedChecker";

import AdminApp from "./admin/AdminApp";

export default function App() {
  return (
    <Routes>

      {/* LOGIN (blocked if logged in) */}
      <Route
        path="/login"
        element={
          <LoggedChecker>
            <Login />
          </LoggedChecker>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin/*"
        element={
          <AuthChecker>
            <AdminApp />
          </AuthChecker>
        }
      />

      {/* MAIN APP */}
      <Route
        path="/"
        element={
          <AuthChecker>
            <Home />
          </AuthChecker>
        }
      />
    </Routes>
  );
}