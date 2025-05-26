import { tagTypes } from "../teg-types";
import { baseApi } from "./baseApi";

const TASK_URL = "/tasks";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTask: build.mutation({
      query: (data) => ({
        url: TASK_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.task],
    }),

    getTask: build.query({
      query: (id) => {
        return {
          url: `${TASK_URL}/${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.task],
    }),

    updateTask: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASK_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.task],
    }),

    deleteTask: build.mutation({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.task],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
