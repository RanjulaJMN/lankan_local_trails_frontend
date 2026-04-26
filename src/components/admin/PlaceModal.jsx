import { useState, useEffect } from "react";
import { X, Upload, Trash2, Compass, Clock, Lightbulb, Plus } from "lucide-react";

export default function PlaceModal({ isOpen, onClose, onSubmit, place, mode = "create", categories = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    openingTime: "",
    closingTime: "",
    distance: "",
    travelTips: "",
    categoryIds: [],
    image: null
  });
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    if (isOpen) {
      console.log("=== PLACE MODAL OPENED ===");
      console.log("Mode:", mode);
      console.log("Place object:", place);
      console.log("Available categories:", categories);
      
      if (place && mode !== "create") {
        console.log("Loading place for edit/view:", place);
        
        // Extract category IDs from the place object
        let categoryIds = [];
        
        // Your API returns categoryIds array
        if (place.categoryIds && Array.isArray(place.categoryIds)) {
          categoryIds = place.categoryIds;
          console.log("Categories from categoryIds array:", categoryIds);
        } else if (place.categories && Array.isArray(place.categories)) {
          categoryIds = place.categories.map(c => c.id);
          console.log("Categories from categories array:", categoryIds);
        } else if (place.category_id) {
          categoryIds = [place.category_id];
          console.log("Single category:", categoryIds);
        }
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: place.name || "",
          description: place.description || "",
          latitude: place.latitude || "",
          longitude: place.longitude || "",
          openingTime: place.openingTime || place.opening_time || "",
          closingTime: place.closingTime || place.closing_time || "",
          distance: place.distance || "",
          travelTips: place.travelTips || place.travel_tips || "",
          categoryIds: categoryIds,
          image: null
        });
        
        // Fix image URL handling for display
        let imageUrl = "";
        const imgUrl = place.imageUrl || place.image_url;
        if (imgUrl) {
          if (imgUrl.startsWith('http')) {
            imageUrl = imgUrl;
          } else if (imgUrl.startsWith('/images/')) {
            imageUrl = `http://localhost:8080${imgUrl}`;
          } else {
            imageUrl = `http://localhost:8080/uploads/${imgUrl}`;
          }
        }
        setPreviewImage(imageUrl);
      } else {
        setFormData({
          name: "",
          description: "",
          latitude: "",
          longitude: "",
          openingTime: "",
          closingTime: "",
          distance: "",
          travelTips: "",
          categoryIds: [],
          image: null
        });
        setPreviewImage("");
      }
      setSelectedCategoryId("");
      setErrors({});
    }
  }, [place, mode, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddCategory = () => {
    if (!selectedCategoryId) {
      setErrors(prev => ({ ...prev, categoryIds: "Please select a category to add" }));
      return;
    }
    
    const categoryId = Number(selectedCategoryId);
    if (formData.categoryIds.includes(categoryId)) {
      setErrors(prev => ({ ...prev, categoryIds: "Category already selected" }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      categoryIds: [...prev.categoryIds, categoryId]
    }));
    setSelectedCategoryId("");
    setErrors(prev => ({ ...prev, categoryIds: "" }));
  };

  const handleRemoveCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.filter(id => id !== categoryId)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Only image files are allowed" }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewImage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Place name is required";
    if (formData.name?.length > 150) newErrors.name = "Name must be less than 150 characters";
    
    if (!formData.latitude) {
      newErrors.latitude = "Latitude is required";
    } else {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat)) {
        newErrors.latitude = "Latitude must be a valid number";
      } else if (lat < -90 || lat > 90) {
        newErrors.latitude = "Latitude must be between -90 and 90";
      }
    }
    
    if (!formData.longitude) {
      newErrors.longitude = "Longitude is required";
    } else {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng)) {
        newErrors.longitude = "Longitude must be a valid number";
      } else if (lng < -180 || lng > 180) {
        newErrors.longitude = "Longitude must be between -180 and 180";
      }
    }
    
    if (!formData.openingTime) newErrors.openingTime = "Opening time is required";
    if (!formData.closingTime) newErrors.closingTime = "Closing time is required";
    if (!formData.distance) newErrors.distance = "Distance is required";
    if (formData.distance && isNaN(formData.distance)) newErrors.distance = "Distance must be a number";
    if (formData.categoryIds.length === 0) newErrors.categoryIds = "Please select at least one category";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Create FormData
    const submitData = new FormData();
    
    // Format latitude and longitude to 8 decimal places
    const formattedLatitude = parseFloat(formData.latitude).toFixed(8);
    const formattedLongitude = parseFloat(formData.longitude).toFixed(8);
    
    // Append ALL fields
    submitData.append("name", formData.name);
    submitData.append("description", formData.description || "");
    submitData.append("latitude", formattedLatitude);
    submitData.append("longitude", formattedLongitude);
    submitData.append("openingTime", formData.openingTime);
    submitData.append("closingTime", formData.closingTime);
    submitData.append("distance", String(formData.distance));
    submitData.append("travelTips", formData.travelTips || "");
    
    // Append each category ID
    formData.categoryIds.forEach(id => {
      submitData.append("categoryIds", String(id));
    });
    
    // Append image if exists
    if (formData.image) {
      submitData.append("image", formData.image);
    }
    
    console.log("Submitting place data:");
    console.log("  categoryIds:", formData.categoryIds);
    console.log("  latitude:", formattedLatitude);
    console.log("  longitude:", formattedLongitude);
    
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Add Place" : mode === "edit" ? "Edit Place" : "View Place";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full z-10 max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="px-6 pt-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Place Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } ${isViewMode ? "bg-gray-50" : ""}`}
                    placeholder="Enter place name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Categories Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories * (Select one or more)
                  </label>
                  
                  {/* Show selected categories */}
                  {formData.categoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.categoryIds.map(categoryId => {
                        const category = categories.find(c => c.id === categoryId);
                        return (
                          <div
                            key={categoryId}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            <span>{category?.name || `Category ${categoryId}`}</span>
                            {!isViewMode && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCategory(categoryId)}
                                className="hover:text-blue-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add category dropdown (only in edit/create mode) */}
                  {!isViewMode && (
                    <div className="flex gap-2">
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a category to add...</option>
                        {categories
                          .filter(cat => !formData.categoryIds.includes(cat.id))
                          .map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Category
                      </button>
                    </div>
                  )}
                  
                  {errors.categoryIds && (
                    <p className="mt-1 text-xs text-red-500">{errors.categoryIds}</p>
                  )}
                  
                  {/* Show message when no categories available to add */}
                  {!isViewMode && categories.filter(cat => !formData.categoryIds.includes(cat.id)).length === 0 && formData.categoryIds.length > 0 && (
                    <p className="mt-2 text-xs text-green-600">All categories have been added</p>
                  )}
                </div>

                {/* Location Fields - Latitude & Longitude */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude * (-90 to 90)
                    </label>
                    <div className="relative">
                      <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        disabled={isViewMode}
                        step="0.00000001"
                        min="-90"
                        max="90"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.latitude ? "border-red-500" : "border-gray-300"
                        } ${isViewMode ? "bg-gray-50" : ""}`}
                        placeholder="e.g., 6.9271"
                      />
                    </div>
                    {errors.latitude && (
                      <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude * (-180 to 180)
                    </label>
                    <div className="relative">
                      <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        disabled={isViewMode}
                        step="0.00000001"
                        min="-180"
                        max="180"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.longitude ? "border-red-500" : "border-gray-300"
                        } ${isViewMode ? "bg-gray-50" : ""}`}
                        placeholder="e.g., 79.8612"
                      />
                    </div>
                    {errors.longitude && (
                      <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>
                    )}
                  </div>
                </div>

                {/* Opening & Closing Times */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="openingTime"
                        value={formData.openingTime}
                        onChange={handleChange}
                        disabled={isViewMode}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.openingTime ? "border-red-500" : "border-gray-300"
                        } ${isViewMode ? "bg-gray-50" : ""}`}
                        placeholder="e.g., 9:00 AM"
                      />
                    </div>
                    {errors.openingTime && (
                      <p className="mt-1 text-xs text-red-500">{errors.openingTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closing Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="closingTime"
                        value={formData.closingTime}
                        onChange={handleChange}
                        disabled={isViewMode}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.closingTime ? "border-red-500" : "border-gray-300"
                        } ${isViewMode ? "bg-gray-50" : ""}`}
                        placeholder="e.g., 6:00 PM"
                      />
                    </div>
                    {errors.closingTime && (
                      <p className="mt-1 text-xs text-red-500">{errors.closingTime}</p>
                    )}
                  </div>
                </div>

                {/* Distance Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    disabled={isViewMode}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.distance ? "border-red-500" : "border-gray-300"
                    } ${isViewMode ? "bg-gray-50" : ""}`}
                    placeholder="Distance from city center"
                  />
                  {errors.distance && (
                    <p className="mt-1 text-xs text-red-500">{errors.distance}</p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isViewMode}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } ${isViewMode ? "bg-gray-50" : ""}`}
                    placeholder="Enter place description"
                  />
                </div>

                {/* Travel Tips */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Tips
                  </label>
                  <div className="relative">
                    <Lightbulb className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="travelTips"
                      value={formData.travelTips}
                      onChange={handleChange}
                      disabled={isViewMode}
                      rows="2"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.travelTips ? "border-red-500" : "border-gray-300"
                      } ${isViewMode ? "bg-gray-50" : ""}`}
                      placeholder="Travel tips for visitors"
                    />
                  </div>
                </div>

                {/* Image Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Place Image
                  </label>
                  
                  {previewImage && (
                    <div className="mb-3 relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                      {!isViewMode && (
                        <button                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {!isViewMode && (
                    <div>
                      <label className="block">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Choose Image</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
                    </div>
                  )}
                  
                  {errors.image && (
                    <p className="mt-1 text-xs text-red-500">{errors.image}</p>
                  )}

                  {isViewMode && !previewImage && (
                    <div className="text-sm text-gray-500 italic">No image available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
              {!isViewMode ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {mode === "create" ? "Create Place" : "Update Place"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}