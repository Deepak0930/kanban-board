import axios from "axios";

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Set your API base URL from env variables
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers["Content-Type"] = config.contentType || "application/json";
    // if (config.token === undefined) {
    //   const accessToken = await getAuth0Token();
    //   if (accessToken) {
    //     config.headers.Authorization = `Bearer ${accessToken}`;
    //   }
    // }
    return config;
  },
  (error) => {
    console.log("Request Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // console.log("AXIOS ERROR:", error.response);
      const { status, data } = error.response;
      // Handle specific status codes
      if (status === 401) {
        console.log("Unauthorized. Redirecting to login...");
      }
      return Promise.reject(data);
    } else if (error.request) {
      console.log("Request Error:", error.request);
    } else {
      console.log("API Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
