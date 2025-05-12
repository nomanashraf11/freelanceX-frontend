import axios from "axios";
import type { AxiosResponse } from "axios";

const BASE_URL = "http://172.31.160.32:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiOptions {
  isAuthRequired?: boolean;
}

const getAuthHeader = (): { Authorization: string } | {} => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getAPI<T>(
  endpoint: string,
  options: ApiOptions = { isAuthRequired: true }
): Promise<AxiosResponse<T>> {
  try {
    return await api.get<T>(endpoint, {
      headers: options.isAuthRequired ? getAuthHeader() : {},
    });
  } catch (error) {
    throw error;
  }
}

export async function postAPI<T>(
  endpoint: string,
  data: unknown,
  options: ApiOptions = { isAuthRequired: true }
): Promise<AxiosResponse<T>> {
  try {
    return await api.post<T>(endpoint, data, {
      headers: options.isAuthRequired ? getAuthHeader() : {},
    });
  } catch (error) {
    throw error;
  }
}

export async function putAPI<T>(
  endpoint: string,
  data: unknown,
  options: ApiOptions = { isAuthRequired: true }
): Promise<AxiosResponse<T>> {
  try {
    return await api.put<T>(endpoint, data, {
      headers: options.isAuthRequired ? getAuthHeader() : {},
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteAPI<T>(
  endpoint: string,
  options: ApiOptions = { isAuthRequired: true }
): Promise<AxiosResponse<T>> {
  try {
    return await api.delete<T>(endpoint, {
      headers: options.isAuthRequired ? getAuthHeader() : {},
    });
  } catch (error) {
    throw error;
  }
}

export async function patchAPI<T>(
  endpoint: string,
  data: unknown,
  options: ApiOptions = { isAuthRequired: true }
): Promise<AxiosResponse<T>> {
  try {
    return await api.patch<T>(endpoint, data, {
      headers: options.isAuthRequired ? getAuthHeader() : {},
    });
  } catch (error) {
    throw error;
  }
}
