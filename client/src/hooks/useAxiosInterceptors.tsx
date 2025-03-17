import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAxiosInterceptors() {
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          navigate("/login", { replace: true });
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
  }, [navigate]);
}
