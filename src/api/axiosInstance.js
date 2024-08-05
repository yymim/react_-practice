import axios from "axios";

const getBaseUrl = () => {
  return String(localStorage.getItem("DD_API_URL")).replace(/"/g, "");
};

let axiosInstance = axios.create({
  baseURL: getBaseUrl(),
});

export default axiosInstance;
