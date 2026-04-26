import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthChecker from "./middleware/AuthChecker";
import LoggedChecker from "./middleware/LoggedChecker";

export default function App() {
  return (
    <Routes>
      {/* login blocked if already authenticated */}
      <Route
        path="/login"
        element={
          <LoggedChecker>
            <Login />
          </LoggedChecker>
        }
      />

      {/* protected area */}
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