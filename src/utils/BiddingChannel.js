import { axiosInstance } from '../../axiosInstance';

const LIMIT = '10';

export const createBiddingProject = async (inputs, from, channel, image) => {
  try {
    const formData = new FormData();
    for (const field in inputs) {
      formData.append(field, inputs[field]);
    }
    formData.append('from', from);
    formData.append('channel', channel);

    if (image?.length !== 0) {
      image.forEach((link, index) => {
        formData.append(`image`, {
          name: `${from}image.jpg`,
          uri: link.uri,
          type: 'image/jpg',
        });
      });
    }

    // formData.append('image', {
    //   name: `${from}image.jpg`,
    //   uri: image.uri,
    //   type: 'image/jpeg',
    // });

    // console.log(formData);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    };
    const data = await axiosInstance.post(
      `/bidChannel/create-project`,
      formData,
      config,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchBiddingProjects = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/bidChannel/get-projects?page=${pageParam}&limit=${LIMIT}`,
  );
  return response.data;
};

export const fetchArchiveProjects = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/bidChannel/get-archiveProjects?page=${pageParam}&limit=${LIMIT}`,
  );
  return response.data;
};

export const updateProjectStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(
      `/bidChannel/update-status/${id}`,
      { status: status },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const subscriptionRequest = async (inputs, id, image) => {
  try {
    const formData = new FormData();
    for (const field in inputs) {
      formData.append(field, inputs[field]);
    }
    formData.append('approvedBy', id);
    formData.append('image', {
      name: `${id}image.jpg`,
      uri: image.uri,
      type: 'image/jpeg',
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    };

    const data = await axiosInstance.post(
      `/bidChannel/create-subreq`,
      formData,
      config,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkAlreadySubReq = async () => {
  try {
    const { data } = await axiosInstance.get(`/bidChannel/check-substatus`);
    return data;
  } catch (error) {
    throw error;
  }
};
