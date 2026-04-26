import api from './axios';

// Helper to log FormData contents
const logFormData = (formData) => {
  console.log("=== FormData Contents ===");
  for (let pair of formData.entries()) {
    if (pair[0] === 'image') {
      console.log(pair[0] + ':', pair[1] instanceof File ? `File: ${pair[1].name}, Type: ${pair[1].type}, Size: ${pair[1].size}` : pair[1]);
    } else if (pair[0] === 'categoryIds') {
      console.log(pair[0] + ':', pair[1]);
    } else {
      console.log(pair[0] + ':', pair[1]);
    }
  }
  console.log("========================");
};

// Get all places
export const getPlaces = async () => {
  try {
    const response = await api.get('api/places');
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

// Create place
export const createPlace = async (formData) => {
  try {
    console.log("🔵 Sending create request to api/places");
    logFormData(formData);
    
    const response = await api.post('api/places', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("✅ Create success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Create error:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

// Update place
export const updatePlace = async (id, formData) => {
  try {
    console.log(`🔵 Sending update request to api/places/${id}`);
    logFormData(formData);
    
    const response = await api.put(`api/places/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("✅ Update success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Update error:", error);
    throw error;
  }
};

// Delete place
export const deletePlace = async (id) => {
  try {
    const response = await api.delete(`api/places/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
};