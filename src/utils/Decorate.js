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

export const AddDesignType = async (name, refetch, isEdit, product) => {
  try {
    let response;
    if (product) {
      response = await axiosInstance.put(
        `/decorations/update-design/${product?._id}`,
        {
          name,
        },
      );
    } else {
      response = await axiosInstance.post('/decorations/post-design', {
        name,
      });
    }
    refetch();
    return response.data;
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

// export const addProduct = async (
//   title,
//   price,
//   image,
//   setImage,
//   setPrice,
//   setTitle,
//   refetch,
//   setismodalVisible,
//   editProductDetails,
// ) => {
//   console.log(image);
//   try {
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('price', price);

//     // if (editProductDetails) {
//     //   formData.append('image', {
//     //     uri: editProductDetails?.image,
//     //     name: editProductDetails?.image,
//     //     type: 'image/jpeg',
//     //   });
//     // } else {
//     //   formData.append('image', {
//     //     uri: image,
//     //     name: image,
//     //     type: 'image/jpeg',
//     //   });
//     // }
//     formData.append('image', {
//       uri: image,
//       name: image,
//       type: 'image/jpeg',
//     });

//     console.log(formData);

//     let response;
//     if (editProductDetails) {
//       response = await axiosInstance.put(
//         `/decorations/update-decor-product/${editProductDetails?._id}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );
//     } else {
//       response = await axiosInstance.post(
//         '/decorations/add-decor-product',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );
//     }

//     // refetch();
//     // setismodalVisible(false);
//     // setImage('');
//     // setPrice('');
//     // setTitle('');
//     // return response.data; // Return response data instead of 'data'
//   } catch (error) {
//     throw error;
//   }
// };

export const addProduct = async (
  title,
  price,
  image,
  setImage,
  setPrice,
  setTitle,
  refetch,
  setismodalVisible,
  editProductDetails,
) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    if (image) {
      formData.append('image', {
        uri: image,
        name: image,
        type: 'image/jpeg',
      });
    }
    console.log(formData);
    let response;
    if (editProductDetails) {
      response = await axiosInstance.put(
        `/decorations/update-decor-product/${editProductDetails?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    } else {
      response = await axiosInstance.post(
        '/decorations/add-decor-product',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    }
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

export const handleAddCatagory = async (
  selectedDesign,
  title,
  Description,
  price,
  products,
  mainImages,
  refetch,
) => {
  try {
    const decorationData = new FormData();
    decorationData.append('categorie', selectedDesign);
    decorationData.append('title', title);
    decorationData.append('Description', Description);
    decorationData.append('price', price);
    decorationData.append('tag', 'Example Tag');

    products.forEach((product, index) => {
      decorationData.append(`products[${index}][productId]`, product.productId);
      decorationData.append(`products[${index}][quantity]`, product.quantity);
    });

    mainImages.forEach((link, index) => {
      decorationData.append(`images`, {
        name: link,
        uri: link,
        type: 'image/jpg',
      });
    });

    const response = await axiosInstance.post(
      '/decorations/add-decoration',
      decorationData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    refetch();
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDecorations = async () => {
  try {
    const { data } = await axiosInstance.get('/decorations/get-decoration');
    return data;
  } catch (error) {
    throw error;
  }
};
