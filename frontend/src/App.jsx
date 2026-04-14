import { Navigate, Route, Routes } from "react-router-dom";
import { BlogDetailPage } from "./pages/BlogDetail";
import { CallbackPage } from "./pages/Callback";
import { HomePage } from "./pages/Home";
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
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/:id"
        element={
          <ProtectedRoute>
            <BlogDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
