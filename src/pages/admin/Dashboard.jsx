import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import { MapPin, FolderTree, Users, Calendar, TrendingUp, Activity } from "lucide-react";
import { getDashboardStats } from "../../api/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPlaces: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalVisitPlans: 0,
    recentPlaces: [],
    userGrowth: 0,
    contentCompletion: 0,
    newUsersThisMonth: 0,
    newPlacesThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        console.log("Dashboard stats:", data);
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      title: "Total Places", 
      value: stats.totalPlaces, 
      icon: MapPin, 
      change: stats.totalPlaces > 0 ? Math.round((stats.newPlacesThisMonth / stats.totalPlaces) * 100) : 0, 
      changeType: "up" 
    },
    { 
      title: "Categories", 
      value: stats.totalCategories, 
      icon: FolderTree, 
      change: 0, 
      changeType: "up" 
    },
    { 
      title: "Active Users", 
      value: stats.totalUsers, 
      icon: Users, 
      change: Math.round(stats.userGrowth), 
      changeType: stats.userGrowth >= 0 ? "up" : "down" 
    },
    { 
      title: "Visit Plans", 
      value: stats.totalVisitPlans, 
      icon: Calendar, 
      change: 0, 
      changeType: "up" 
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Places */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Places</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentPlaces && stats.recentPlaces.length > 0 ? (
              stats.recentPlaces.map((place) => (
                <div key={place.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-700">{place.name}</span>
                    {place.categoryNames && (
                      <span className="text-xs text-gray-500 ml-2">({place.categoryNames})</span>
                    )}
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    {formatDate(place.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No places added yet</p>
            )}
          </div>
          {stats.recentPlaces && stats.recentPlaces.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button 
                onClick={() => window.location.href = '/admin/places'}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Places →
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Content Completion</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(stats.contentCompletion)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(stats.contentCompletion, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalPlaces} places across {stats.totalCategories} categories
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">User Growth</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.userGrowth >= 0 ? '+' : ''}{Math.round(stats.userGrowth)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(Math.abs(stats.userGrowth), 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.newUsersThisMonth} new users this month
              </p>
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                <p className="text-xs text-gray-500">Categories</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{stats.totalPlaces}</p>
                <p className="text-xs text-gray-500">Total Places</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{stats.newPlacesThisMonth}</p>
                <p className="text-xs text-gray-500">New Places (30d)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}