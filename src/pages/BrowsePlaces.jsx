import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock } from "lucide-react";
import { getPlaces } from "../api/placeApi";

export default function BrowsePlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const data = await getPlaces();
      console.log("API response:", data);
      
      // Handle both array and paginated response
      let placesArray = [];
      if (Array.isArray(data)) {
        placesArray = data;
      } else if (data && data.content) {
        placesArray = data.content;
      } else {
        placesArray = [];
      }
      
      setPlaces(placesArray);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  // Simple search filter
  const filteredPlaces = places.filter(place => {
    if (!searchTerm) return true;
    return place.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Discover Places</h1>
          <p>Loading places...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 p-4 rounded">{error}</div>
          <button onClick={fetchPlaces} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Places</h1>
        <p className="text-gray-600 mb-6">Explore tourist attractions in Sri Lanka</p>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Places grid */}
        {filteredPlaces.length === 0 ? (
          <p>No places found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map(place => (
              <Link key={place.id} to={`/places/${place.id}`} className="group">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md">
                  <div className="h-48 bg-gray-200 relative">
                    {place.imageUrl ? (
                      <img 
                        src={`http://localhost:8080${place.imageUrl}`}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs">
                      {place.distance} km
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{place.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{place.openingTime || '?'} - {place.closingTime || '?'}</span>
                    </div>
                    {place.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{place.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}