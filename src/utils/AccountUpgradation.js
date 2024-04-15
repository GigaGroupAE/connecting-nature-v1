import { axiosInstance } from '../../axiosInstance';

export const addRequest = async (
  inputs,
  cnicFront,
  cnicBack,
  utilityBill,
  name,
  role,
) => {
  try {
    const formData = new FormData();
    for (const field in inputs) {
      formData.append(field, inputs[field]);
    }
    formData.append('requestedRole', role);
    if (cnicFront) {
      formData.append('cnicFront', {
        name: `${name}cnicfrontimage.jpg`,
        uri: cnicFront.uri,
        type: 'image/jpeg',
      });
    }
    if (cnicBack) {
      formData.append('cnicBack', {
        name: `${name}cnicbackimage.jpg`,
        uri: cnicBack.uri,
        type: 'image/jpeg',
      });
    }
    if (utilityBill) {
      formData.append('utililtyBill', {
        name: `${name}utilitybillimage.jpg`,
        uri: utilityBill.uri,
        type: 'image/jpeg',
      });
    }
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    };
    const data = await axiosInstance.post(
      `/upgradeRequests/addRequest`,
      formData,
      config,
    );
    return data;
  } catch (error) {
    throw error;
  }
};
