import { Api } from "./Api";

const BlockedUsersApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getBlockedUsers: builder.query({
      query: (token) => ({
        url: "/user/get-blockedUsers",
        headers: {
          "auth-token": token,
        },
      }),
      providesTags: ["BlockedUsers"],
    }),
    unblockUser: builder.mutation({
      query: ({ token, id }) => ({
        url: `/user/unblock-user/${id}`,
        headers: {
          "auth-token": token,
        },
        method: "PATCH",
      }),
      invalidatesTags: ["BlockedUsers"],
    }),
    //block user user
    blockUser: builder.mutation({
      query: ({ token, id }) => ({
        url: `/user/block-user/${id}`,
        headers: {
          "auth-token": token,
        },
        method: "PATCH",
      }),
      invalidatesTags: ["BlockedUsers"],
    }),
  }),
});
export const {
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
  useBlockUserMutation,
} = BlockedUsersApi;
