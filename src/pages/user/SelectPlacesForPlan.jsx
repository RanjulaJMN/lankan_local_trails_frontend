import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaces } from "../../api/placeApi";
import { generateVisitPlan } from "../../api/planApi";
import { Loader, MapPin } from "lucide-react";

export default function SelectPlacesForPlan() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    const data = await getPlaces();
    setPlaces(Array.isArray(data) ? data : data.content || []);
  };

  const toggleSelect = (id) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const handleGenerate = async () => {
    if (selected.size === 0) {
      setError("Please select at least one place.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await generateVisitPlan({
        planDate: new Date().toISOString().split("T")[0],
        placeIds: Array.from(selected)
      });
      navigate("/user/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your One‑Day Plan</h1>
        <p className="text-gray-600 mb-6">Select places you'd like to visit. We'll create an optimized itinerary with travel times.</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {places.map((place) => (
            <div
              key={place.id}
              onClick={() => toggleSelect(place.id)}
              className={`cursor-pointer border rounded-xl p-4 transition ${
                selected.has(place.id)
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:shadow-md bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className={`w-5 h-5 mt-0.5 ${selected.has(place.id) ? "text-blue-600" : "text-gray-400"}`} />
                <div>
                  <h3 className="font-semibold text-gray-900">{place.name}</h3>
                  <p className="text-sm text-gray-500">
                    {place.openingTime || "Always Open"} – {place.closingTime || "Always Open"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Generating Itinerary..." : "Generate My Day Plan"}
        </button>
      </div>
    </div>
  );
}