import { createEntityAdapter } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../CONSTANTS";

const notificationsAdapter = createEntityAdapter({
  selectId: (item) => item._id,
});

export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: [
    "Notifications",
    "BlockedUsers",
    "Products",
    "AccoutUpgradeRequests",
  ],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ token, page, limit }) => ({
        url: `/notify/getnoties?page=${1}&limit=${15}`,
        headers: {
          "auth-token": token,
        },
      }),
      

      providesTags: ["Notifications"],
    }),
    updateVolunteer: builder.mutation({
      query: ({ token, campaignId, phoneNumber, newStatus }) => ({
        url: `/today/update-volunteer/${campaignId}`,
        headers: {
          "auth-token": token,
        },
        method: "PUT",
        body: {
          phoneNumber,
          status: newStatus,
        },
      }),
    }),
    //this mutation will cause a refetch to getNotifications
    updateNotifications: builder.mutation({
      query: ({ token, notificationId, title }) => ({
        url: `/notify/change-notification-type/${notificationId}`,
        headers: {
          "auth-token": token,
        },
        method: "PATCH",
        body: {
          title,
        },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
  useUpdateVolunteerMutation,
} = Api;
