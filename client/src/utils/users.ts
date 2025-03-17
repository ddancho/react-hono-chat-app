import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { User } from "../types";
import { logAxiosErrors } from "../helpers";

export async function getUsers() {
  try {
    const response = await axiosInstance.get<User[]>("/users");

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logAxiosErrors("getUsers", error.response);
    }

    return [];
  }
}
