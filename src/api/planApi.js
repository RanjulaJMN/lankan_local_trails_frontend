import api from './axios';

export const generateVisitPlan = async (planData) => {
  const response = await api.post('/api/visit-plans/generate', planData);
  return response.data;
};

export const getUserPlans = async () => {
  const response = await api.get('/api/visit-plans/user');
  return response.data;
};