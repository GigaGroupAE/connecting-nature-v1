import axios from 'axios';
import { BASE_URL } from '../../CONSTANTS';
export const SendNotifications = async ({ title, postId, userState }) => {
  const config = {
    headers: {
      'auth-token': userState.token,
    },
  };

  axios
    .post(
      `${BASE_URL}/notify/addnotification`,
      {
        user: userState.id,

        body: {
          //This title will be the notification that is going to be send to the user
          //title: "Someone liked your post"
          title: title,
        },

        data: {
          //This title is the one stored on the backed
          //"post-like", "post-comment"
          title: title,
          content: postId,
        },
      },
      config,
    )
    .then((res) => {
      //any logic you want here
    })
    .catch((e) => {
      //any logic you want here
    });
};
