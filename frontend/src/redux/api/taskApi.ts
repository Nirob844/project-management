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

    getTasks: build.query({
      query: () => ({
        url: TASK_URL,
        method: "GET",
      }),
      providesTags: [tagTypes.task],
    }),

    getMyTask: build.query({
      query: () => ({
        url: `${TASK_URL}/my-tasks`,
        method: "GET",
      }),
      providesTags: [tagTypes.task],
    }),

    getTaskById: build.query({
      query: (id) => {
        return {
          url: `${TASK_URL}/${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.task],
    }),

    getTaskByProjectId: build.query({
      query: (projectId) => {
        return {
          url: `${TASK_URL}/project/${projectId}`,
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
  useGetTasksQuery,
  useGetMyTaskQuery,
  useGetTaskByIdQuery,
  useGetTaskByProjectIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
