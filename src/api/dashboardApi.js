import api from './axios';

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('api/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};