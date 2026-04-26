import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Components
import Home from "./pages/Home";
import BrowsePlaces from "./pages/BrowsePlaces"; 
import PlaceDetails from "./pages/PlaceDetails";

// Admin Components
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Places from "./pages/admin/Places";
import Users from "./pages/admin/Users";
import VisitPlans from "./pages/admin/VisitPlans";
import MapView from "./pages/MapView";

// User Components
import UserLayout from "./layouts/UserLayout";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";

function AppRoutes() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/places" element={<BrowsePlaces />} />
      <Route path="/places/:id" element={<PlaceDetails />} />
      <Route path="/map" element={<MapView />} />
      {/* Admin Auth Routes */}
      <Route path="/admin/login" element={
        isAuthenticated && role === "ADMIN" ? 
          <Navigate to="/admin" replace /> :
          <AdminLogin />
      } />
      <Route path="/admin/register" element={
        isAuthenticated && role === "ADMIN" ? 
          <Navigate to="/admin/dashboard" replace /> : 
          <AdminRegister />
      } />

      {/* User Auth Routes */}
      <Route path="/login" element={
        isAuthenticated && role === "USER" ? 
          <Navigate to="/user/dashboard" replace /> : 
          <UserLogin />
      } />
      <Route path="/register" element={
        isAuthenticated && role === "USER" ? 
          <Navigate to="/user/dashboard" replace /> : 
          <UserRegister />
      } />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="places" element={<Places />} />
        <Route path="users" element={<Users />} />
        <Route path="visit-plans" element={<VisitPlans />} />
      </Route>

      {/* User Protected Routes */}
      <Route path="/user" element={
        <ProtectedRoute requiredRole="USER">
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;