import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderTree, 
  MapPin, 
  Users, 
  Calendar,
  X 
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Categories", path: "/admin/categories", icon: FolderTree },
  { name: "Places", path: "/admin/places", icon: MapPin },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Visit Plans", path: "/admin/visit-plans", icon: Calendar },
];

export default function Sidebar({ setSidebarOpen }) {
  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col h-full">
      {/* Logo and close button */}
      <div className="flex items-center justify-between p-5 border-b border-gray-700">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AdminPanel
          </h1>
          <p className="text-xs text-gray-400 mt-1">Lankan Local Trails</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 rounded-lg hover:bg-gray-700 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer in sidebar */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          © 2024 Admin Panel
        </p>
      </div>
    </div>
  );
}