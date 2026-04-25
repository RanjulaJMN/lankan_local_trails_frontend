import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import { MapPin, FolderTree, Users, Calendar, TrendingUp, Activity } from "lucide-react";
import { getCategories } from "../../api/categoryApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    places: 0,
    categories: 0,
    users: 0,
    visitPlans: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try to fetch categories – if it fails, we still show other hardcoded stats
        let categoriesCount = 0;
        try {
          const categoriesData = await getCategories();
          categoriesCount = Array.isArray(categoriesData) ? categoriesData.length : 0;
        } catch (apiErr) {
          console.warn("Failed to fetch categories:", apiErr);
          // Keep categoriesCount = 0, but don't crash the whole dashboard
        }

        // Set all stats (you can replace hardcoded numbers with real API calls later)
        setStats({
          places: 45,        // TODO: replace with API call
          categories: categoriesCount,
          users: 128,       // TODO: replace with API call
          visitPlans: 32    // TODO: replace with API call
        });
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Places", value: stats.places, icon: MapPin, change: 12, changeType: "up" },
    { title: "Categories", value: stats.categories, icon: FolderTree, change: 5, changeType: "up" },
    { title: "Active Users", value: stats.users, icon: Users, change: 8, changeType: "up" },
    { title: "Visit Plans", value: stats.visitPlans, icon: Calendar, change: 3, changeType: "down" }
  ];

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">⚠️ {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm text-red-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Places</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {['Ella Rock', 'Nine Arches Bridge', 'Adams Peak'].map((place, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">{place}</span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">New</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Content Completion</span>
                <span className="text-sm font-medium text-gray-900">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">User Growth</span>
                <span className="text-sm font-medium text-gray-900">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}