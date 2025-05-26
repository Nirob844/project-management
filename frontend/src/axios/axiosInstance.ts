import { authKey } from "@/constants/storage";
import { getFromLocalStorage } from "@/utils/local-storage";
import axios, { AxiosError } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    const responseObject = {
      statusCode: error?.response?.status || 500,
      message:
        (error?.response?.data as { message?: string })?.message ||
        "Something went wrong",
      errorMessages:
        (error?.response?.data as { errorMessages?: string[] })
          ?.errorMessages || [],
    };

    // Handle specific error cases
    if (error?.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem(authKey);
      window.location.href = "/login";
    }

    if (error?.response?.status === 403) {
      // Handle forbidden access
      responseObject.message =
        "You don't have permission to access this resource";
    }

    if (error?.response?.status === 404) {
      // Handle not found
      responseObject.message = "The requested resource was not found";
    }

    if (error?.response?.status === 500) {
      // Handle server error
      responseObject.message = "Internal server error occurred";
    }

    return Promise.reject(responseObject);
  }
);

export { instance };
