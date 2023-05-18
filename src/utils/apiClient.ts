import axios, { AxiosInstance } from "axios";
import { getAuthHeader } from "./sessionManagement";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/v0",
});

export const setHeader = (token: string): void => {
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const discardHeader = (): void => {
  delete apiClient.defaults.headers.common.Authorization;
};

apiClient.defaults.headers.common.Authorization = `Bearer ${getAuthHeader()}`;

export default apiClient;
