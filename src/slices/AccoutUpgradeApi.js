import { Api } from './Api';

const AccountUpgradeApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query({
      query: (token) => ({
        url: '/upgradeRequests/getAllRequests',
        headers: {
          'auth-token': token,
        },
      }),
      providesTags: ['AccoutUpgradeRequests'],
    }),
    addRequest: builder.mutation({
      query: ({ token, body }) => ({
        url: `/upgradeRequests/addRequest`,
        headers: {
          'auth-token': token,
        },
        body: body,
        method: 'POST',
      }),
      invalidatesTags: ['AccoutUpgradeRequests'],
    }),
    approveRequest: builder.mutation({
      query: ({ token, body, id }) => ({
        url: `/upgradeRequests/approveRequest/${id}`,
        headers: {
          'auth-token': token,
        },
        body: body,
        method: 'PATCH',
      }),

      invalidatesTags: ['AccoutUpgradeRequests'],
    }),
    declineRequest: builder.mutation({
      query: ({ token, id, body }) => ({
        url: `/upgradeRequests/declineRequest/${id}`,
        headers: {
          'auth-token': token,
        },
        body: body,
        method: 'PATCH',
      }),
      invalidatesTags: ['AccoutUpgradeRequests'],
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetRequestsQuery,
  useAddRequestMutation,
  useApproveRequestMutation,
  useDeclineRequestMutation,
} = AccountUpgradeApi;
