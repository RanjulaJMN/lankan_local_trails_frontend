// src/pages/admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminLogin } from "../../api/authApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await adminLogin(formData);
      console.log("Login response:", response);
      
      // Check if we have user data
      if (response.user) {
        const userRole = response.user.role;
        console.log("User role:", userRole);
        
        if (userRole !== "ROLE_ADMIN") {
          setError("Access denied. Admin privileges required.");
          localStorage.clear();
          setLoading(false);
          return;
        }
        
        setSuccess("Login successful! Redirecting to admin panel...");
        
        // Update auth context
        setAuthUser(response.user, "ADMIN");
        
        // Navigate after delay
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 1000);
      } else {
        setError("Failed to get user information. Please try again.");
        setLoading(false);
      }
      
    } catch (err) {
      console.error("Login error details:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          "Admin login failed. Please check your credentials.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access administrator panel</p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an admin account?{" "}
          <Link to="/admin/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register as Admin
          </Link>
        </p>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="hover:text-gray-700">
            User login instead?
          </Link>
        </p>
      </div>
    </div>
  );
}