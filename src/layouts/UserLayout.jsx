import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/authApi";

export default function UserLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar for Users */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Travel Explorer</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}