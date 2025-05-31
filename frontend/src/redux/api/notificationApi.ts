import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<Notification[], void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: [tagTypes.notification],
    }),
    markNotificationAsRead: build.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
    markAllNotificationsAsRead: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
    deleteNotification: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
