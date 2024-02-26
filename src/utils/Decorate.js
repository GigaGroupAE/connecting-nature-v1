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

export const AddDesignType = async (name, refetch) => {
  try {
    const { data } = await axiosInstance.post('/decorations/post-design', {
      name,
    });
    refetch();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDesignType = async () => {
  try {
    const response = await axiosInstance.get('/decorations/get-design');
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (
  title,
  price,
  image,
  setImage,
  setPrice,
  setTitle,
  refetch,
  setismodalVisible,
) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('image', {
      uri: image,
      name: image,
      type: 'image/jpeg',
    });

    const { data } = await axiosInstance.post(
      '/decorations/add-decor-product',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    refetch();
    setismodalVisible(false);
    setImage(''), setPrice(''), setTitle('');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const { data } = await axiosInstance.get('/decorations/getDecorProducts');
    return data?.data;
  } catch (error) {
    throw error;
  }
};
