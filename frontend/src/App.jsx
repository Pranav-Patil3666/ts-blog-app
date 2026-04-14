import { Navigate, Route, Routes } from "react-router-dom";
import { CallbackPage } from "./pages/Callback";
import { LoginPage } from "./pages/Login";
import { ProfilePage } from "./pages/ProfilePage";
import { isAuthenticated } from "./utils/auth";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? "/profile" : "/login"} replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
