import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Eye, Search, Compass, Clock } from "lucide-react";
import { getPlaces, createPlace, updatePlace, deletePlace } from "../../api/placeApi";
import { getCategories } from "../../api/categoryApi";
import PlaceModal from "../../components/admin/PlaceModal";
import { ToastContainer } from "../../components/ui/Toast";
import api from "../../api/axios";

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  // Toast states
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await getPlaces();
      console.log("Full API Response:", response);
      
      // Handle different response structures
      let placesArray = [];
      if (response && response.content) {
        placesArray = response.content;
      } else if (Array.isArray(response)) {
        placesArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        placesArray = response.data;
      } else if (response && response.places) {
        placesArray = response.places;
      } else {
        placesArray = [];
      }
      
      // Map the places with categories
      const mappedPlaces = placesArray.map(place => {
        console.log(`Processing place ${place.id}:`, place);
        
        // Try to get categories from different possible field names
        let placeCategories = [];
        if (place.categories && Array.isArray(place.categories)) {
          placeCategories = place.categories;
        } else if (place.categoryList && Array.isArray(place.categoryList)) {
          placeCategories = place.categoryList;
        } else if (place.placeCategories && Array.isArray(place.placeCategories)) {
          placeCategories = place.placeCategories;
        }
        
        console.log(`Categories for place ${place.id}:`, placeCategories);
        
        return {
          id: place.id,
          name: place.name,
          description: place.description,
          latitude: place.latitude,
          longitude: place.longitude,
          openingTime: place.openingTime || place.opening_time,
          closingTime: place.closingTime || place.closing_time,
          distance: place.distance,
          travelTips: place.travelTips || place.travel_tips,
          imageUrl: place.imageUrl || place.image_url,
          categories: placeCategories,
          categoryNames: placeCategories.map(c => c.name).join(', ')
        };
      });
      
      console.log("Mapped places:", mappedPlaces);
      setPlaces(mappedPlaces);
    } catch (error) {
      console.error("Error loading places", error);
      addToast(error.message || "Failed to load places", "error");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      console.log("Categories API Response:", data);
      
      let categoriesArray = [];
      if (Array.isArray(data)) {
        categoriesArray = data;
      } else if (data && data.content) {
        categoriesArray = data.content;
      } else if (data && data.data && Array.isArray(data.data)) {
        categoriesArray = data.data;
      } else {
        categoriesArray = [];
      }
      
      const mappedCategories = categoriesArray.map(cat => ({
        id: cat.id,
        name: cat.name
      }));
      console.log("Mapped categories:", mappedCategories);
      setCategories(mappedCategories);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlaces();
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setSelectedPlace(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEdit = async (place) => {
    console.log("Editing place:", place);
    
    // Fetch the full place details including categories
    try {
      const response = await api.get(`/places/${place.id}`);
      console.log("Full place details for edit:", response.data);
      
      let placeData = response.data;
      if (placeData.data) placeData = placeData.data;
      
      setSelectedPlace(placeData);
      setModalMode("edit");
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching place details:", error);
      // Fallback to the place from the list
      setSelectedPlace(place);
      setModalMode("edit");
      setModalOpen(true);
    }
  };

  const handleView = async (place) => {
    console.log("Viewing place:", place);
    
    // Fetch the full place details including categories
    try {
      const response = await api.get(`/places/${place.id}`);
      console.log("Full place details for view:", response.data);
      
      let placeData = response.data;
      if (placeData.data) placeData = placeData.data;
      
      setSelectedPlace(placeData);
      setModalMode("view");
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching place details:", error);
      // Fallback to the place from the list
      setSelectedPlace(place);
      setModalMode("view");
      setModalOpen(true);
    }
  };

  const handleDelete = async (place) => {
    if (window.confirm(`Are you sure you want to delete "${place.name}"?`)) {
      try {
        await deletePlace(place.id);
        addToast(`Place "${place.name}" deleted successfully`, "success");
        fetchPlaces();
      } catch (error) {
        addToast(error.message || "Failed to delete place", "error");
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        await createPlace(formData);
        addToast("Place created successfully", "success");
      } else if (modalMode === "edit") {
        await updatePlace(selectedPlace.id, formData);
        addToast("Place updated successfully", "success");
      }
      setModalOpen(false);
      fetchPlaces();
    } catch (error) {
      addToast(error.response?.data?.message || error.message || "Operation failed", "error");
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/images/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    
    return `http://localhost:8080/uploads/${imageUrl}`;
  };

  const filteredPlaces = places.filter(place =>
    place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.categoryNames?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Places</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Places</h1>
          <p className="text-gray-600 mt-1">Manage tourist places and attractions</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Place
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search places by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Places Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance (km)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlaces.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? "No places match your search" : "No places found"}
                  </td>
                </tr>
              ) : (
                filteredPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{place.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.imageUrl ? (
                        <img
                          src={getImageUrl(place.imageUrl)}
                          alt={place.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-400">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{place.name}</div>
                      {place.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{place.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {place.categories && place.categories.map(cat => (
                          <span key={cat.id} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {cat.name}
                          </span>
                        ))}
                        {(!place.categories || place.categories.length === 0) && (
                          <span className="text-xs text-gray-400">No categories</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Compass className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {place.latitude}, {place.longitude}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {place.openingTime} - {place.closingTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{place.distance} km</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(place)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(place)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(place)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PlaceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        place={selectedPlace}
        mode={modalMode}
        categories={categories}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}