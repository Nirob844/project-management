import { tagTypes } from "../teg-types";
import { baseApi } from "./baseApi";

const USER_URL = "/users";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (data) => ({
        url: USER_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    getUsers: build.query({
      query: () => {
        return {
          url: USER_URL,
          method: "GET",
        };
      },
      providesTags: [tagTypes.user],
    }),

    getProfile: build.query({
      query: () => {
        return {
          url: `${USER_URL}/profile`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.user],
    }),

    getUserById: build.query({
      query: (id) => {
        return {
          url: `${USER_URL}/${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.user],
    }),

    updateUser: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${USER_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    updateProfile: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${USER_URL}/profile`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    deleteUser: build.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetProfileQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useDeleteUserMutation,
} = userApi;
