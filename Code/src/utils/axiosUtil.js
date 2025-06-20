import axios from "axios";
import { removeAuth } from "../helpers/auth";
import { defaultConfig } from "../config";
import { ErrorMessage } from "../helpers/common";

const axiosInt = axios.create({
  baseURL: defaultConfig.baseAPIUrl,
});

const code = JSON.parse(localStorage.getItem("code"));

axiosInt.interceptors.response.use(
  (response) => {
    if (response.data.message === "Tenant not found.") {
      removeAuth();
      window.location.href = `/${code || "admin"}`;
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      removeAuth();
      window.location.href = `/${code || "admin"}`;
    }
    if (error?.response?.status === 403) {
      ErrorMessage("You do not have permission!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } else {
      if (error?.response?.status === 400) {
        const allErrors = Object.entries(error?.response?.data?.errors).flatMap(
          ([field, messages]) => messages.map((msg) => `${field}:${msg}`)
        );
        ErrorMessage(allErrors[0]);
      } else {
        ErrorMessage(error?.message);
      }
    }
  }
);

export default axiosInt;
