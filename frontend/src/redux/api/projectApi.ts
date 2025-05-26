import { tagTypes } from "../teg-types";
import { baseApi } from "./baseApi";

const PROJECT_URL = "/projects";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation({
      query: (data) => ({
        url: PROJECT_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.project],
    }),

    getProjects: build.query({
      query: (id) => {
        return {
          url: `${PROJECT_URL}/${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.project],
    }),

    updateProject: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.project],
    }),

    deleteProject: build.mutation({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.project],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
