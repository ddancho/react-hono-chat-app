import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { User, UserSignUp, ServerResponse, UserSignIn } from "../types";
import { logAxiosErrors } from "../helpers";

export async function loginUser(data: UserSignIn): Promise<ServerResponse> {
  try {
    const response = await axiosInstance.post<User>("/auth/login", data);

    const res: ServerResponse = {
      status: "success",
      user: response.data,
    };

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("loginUser", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}

export async function logoutUser(): Promise<ServerResponse> {
  try {
    await axiosInstance.post("/auth/logout");

    const res: ServerResponse = {
      status: "success",
    };

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("logoutUser", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}

export async function registerUser(data: UserSignUp): Promise<ServerResponse> {
  try {
    await axiosInstance.post("/auth/register", data);

    const res: ServerResponse = {
      status: "success",
    };

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("registerUser", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}

export async function checkCurrentUser() {
  try {
    const response = await axiosInstance.get<User>("/users/current-user");

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logAxiosErrors("checkCurrentUser", error.response);
    }

    return null;
  }
}

export async function updateProfileImage(formData: FormData) {
  try {
    await axiosInstance.post("/auth/update-profile", formData, {
      headers: { "content-type": "multipart/form-data" },
    });

    const res: ServerResponse = {
      status: "success",
    };

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("updateProfileImage", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}
