import { axiosInstance } from '../../axiosInstance';

export const fetchAffordabilityData = async () => {
  try {
    const response = await axiosInstance.get(
      '/decorations/get-affordabilities',
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
