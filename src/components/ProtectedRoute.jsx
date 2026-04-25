import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (requiredRole === "ADMIN") {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "USER") {
      return <Navigate to="/user/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}