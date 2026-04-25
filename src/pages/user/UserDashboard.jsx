import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600">
            This is your user dashboard. You can view places, create visit plans, and more.
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Explore Places</h3>
              <p className="text-sm text-blue-700 mt-1">Discover amazing locations</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">My Visit Plans</h3>
              <p className="text-sm text-green-700 mt-1">Plan your next adventure</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Favorites</h3>
              <p className="text-sm text-purple-700 mt-1">Your saved places</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}