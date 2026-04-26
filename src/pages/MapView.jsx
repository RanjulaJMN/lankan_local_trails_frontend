// src/pages/MapView.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPlaces } from "../api/placeApi";
import { MapPin, Loader, Navigation } from "lucide-react";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon (optional - if you want a different color)
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const data = await getPlaces();
      console.log("Raw places data:", data);
      
      let placesArray = Array.isArray(data) ? data : data?.content || [];
      
      // Filter places with valid coordinates
      const validPlaces = placesArray.filter(place => {
        const hasValidLat = place.latitude != null && !isNaN(place.latitude);
        const hasValidLng = place.longitude != null && !isNaN(place.longitude);
        
        if (!hasValidLat || !hasValidLng) {
          console.warn(`Place ${place.name} has invalid coordinates:`, place.latitude, place.longitude);
        }
        return hasValidLat && hasValidLng;
      });
      
      console.log(`Found ${validPlaces.length} valid places out of ${placesArray.length}`);
      setPlaces(validPlaces);
      
      // If we have places, center on the first place
      if (validPlaces.length > 0) {
        setCenter([validPlaces[0].latitude, validPlaces[0].longitude]);
        setZoom(10);
      }
    } catch (err) {
      console.error("Error loading places for map:", err);
      setError("Failed to load places. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading places on map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Map</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPlaces}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Explore Places Map</h1>
          </div>
          <p className="text-blue-100">
            Discover all tourist attractions across Sri Lanka
          </p>
          <div className="mt-3 flex gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              🗺️ {places.length} Locations Found
            </span>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative" style={{ height: "70vh", minHeight: "500px" }}>
            {places.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No places with valid coordinates found.</p>
                  <p className="text-sm text-gray-400 mt-2">Make sure places have latitude and longitude in the database.</p>
                </div>
              </div>
            ) : (
              <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {places.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="min-w-[200px] max-w-xs">
                        {place.imageUrl && (
                          <img
                            src={`http://localhost:8080${place.imageUrl}`}
                            alt={place.name}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                            onError={(e) => e.target.style.display = "none"}
                          />
                        )}
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {place.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {place.description?.substring(0, 100)}
                          {place.description?.length > 100 ? "..." : ""}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={`https://www.openstreetmap.org/directions?from=&to=${place.latitude},${place.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            <Navigation className="w-3 h-3" />
                            Directions
                          </a>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                          >
                            Google Maps
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Places List Section */}
        {places.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              All Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                  onClick={() => {
                    setCenter([place.latitude, place.longitude]);
                    setZoom(15);
                  }}
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700 flex-1">{place.name}</span>
                  <span className="text-xs text-gray-500">
                    {place.distance ? `${place.distance} km` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}