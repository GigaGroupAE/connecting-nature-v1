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
          type: link.type,
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

export const announceWinner = async (id, status, bidId) => {
  const data = {
    status: status,
    winner: bidId,
  };
  try {
    const response = await axiosInstance.patch(
      `/bidChannel/winner-announce/${id}`,
      data,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchChannels = async () => {
  try {
    const { data } = await axiosInstance.get('/bidChannel/get-channel');
    return data;
  } catch (error) {
    throw error;
  }
};

export const handleRemoveSubscriber = async (id, memberId, userId) => {
  console.log(memberId);
  try {
    const data = await axiosInstance.patch(
      `/bidChannel/remove-member-chanel/${id}`,
      {
        memberId,
        userId,
      },
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getscriptonReq = async () => {
  try {
    const { data } = await axiosInstance.get(
      '/bidChannel/get-subscription-req',
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchClosedBidApartments = async () => {
  try {
    const { data } = await axiosInstance.get(
      '/bidChannel/closed-bid-apartments',
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const handleDownloadProject = async (id) => {
  try {
    const data = await axiosInstance.get(`/bidChannel/download-report/${id}`);
    throw data;
  } catch (error) {
    throw error;
  }
};
