import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const [visitPlans, setVisitPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchVisitPlans();
  }, []);

  const fetchVisitPlans = async () => {
    try {
      // TODO: Replace with actual API call
      // const data = await getMyVisitPlans();
      // setVisitPlans(data);
      
      // Mock data for now
      setVisitPlans([
        {
          id: 1,
          name: "Historical Tour",
          date: "2024-12-15",
          places: [
            { id: 1, name: "Sigiriya Rock", time: "9:00 AM" },
            { id: 2, name: "Dambulla Cave Temple", time: "1:00 PM" }
          ]
        }
      ]);
    } catch (error) {
      console.error("Error fetching visit plans:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Visit Plans</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
          </div>
          <Link
            to="/places"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Plan
          </Link>
        </div>

        {/* Visit Plans List */}
        {visitPlans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Visit Plans Yet</h3>
            <p className="text-gray-500 mb-4">Start planning your one-day adventure!</p>
            <Link
              to="/places"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Explore Places
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visitPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm opacity-90 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {plan.date}
                      </p>
                    </div>
                    <button className="p-1 hover:bg-white/20 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Places to Visit</h4>
                  <div className="space-y-3">
                    {plan.places.map(place => (
                      <div key={place.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{place.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {place.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link
                      to={`/user/visit-plan/${plan.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Full Schedule →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}