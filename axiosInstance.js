import axios from "axios";
import { BASE_URL } from "./CONSTANTS";
import { store } from "./store";

export const axiosInstance = axios.create({ baseURL: BASE_URL });
axiosInstance.interceptors.request.use((request) => {
  const token = store.getState().user.token;
  request.headers["auth-token"] = token;
  return request;
});
