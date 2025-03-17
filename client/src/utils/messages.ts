import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { Message, ServerResponse } from "../types";
import { logAxiosErrors } from "../helpers";

export async function getMessages(userId: string) {
  try {
    const response = await axiosInstance.get<Message[]>(`/messages/${userId}`);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logAxiosErrors("getMessages", error.response);
    }

    return [];
  }
}

export async function sendMessage(receiverId: string, formData: FormData) {
  try {
    const response = await axiosInstance.post<Message>(
      `/messages/send/${receiverId}`,
      formData
    );

    const res: ServerResponse = {
      status: "success",
    };

    if (response.data) {
      res.text = response.data;
    }

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("sendMessage", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}
