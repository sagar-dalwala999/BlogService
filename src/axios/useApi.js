import { toast } from "sonner"
import Cookies from "js-cookie";
import axiosInstance from "./AxiosInterceptor";

const redirectTo = (path) => {
  window.location.href = path;
};

const apiRequest = async ({
  url,
  method,
  data,
  token,
  showToast = true,
  isApplicationJson = false,
  signal = null,
}) => {
  try {
    const headersProp = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance({
      url,
      method,
      data,
      signal,
      headers: {
        "Content-Type": isApplicationJson
          ? "application/json"
          : "multipart/form-data",
        ...headersProp,
      },
    });

    if (response.success) {
      if (showToast) {
        toast.success(response.message);
      }
      return {
        success: true,
        data: response.data,
      };
    } else {
      if (response?.status == 401) {
        localStorage.removeItem("persist:fields");
        localStorage.removeItem("logiBriskUser");
        Cookies.remove("logibrisk");
        toast.error(response.errorDetail[0].errorMessage);
        
      } else {
        
        toast.error(response.errorDetail[0].errorMessage);
      }
      return {
        success: false,
        data: response.data,
      };
    }
  } catch (error) {

    // Handle special error types from our interceptor
    if (error.isTimeout) {
      if (showToast) {
        toast.error(error.message || "Request timed out");
      }
      return {
        success: false,
        error: "timeout",
        message: error.message || "Request timed out",
      };
    }

    if (error.isNetworkError) {
      if (showToast) {
        toast.error(error.message || "Network error");
      }
      return {
        success: false,
        error: "network",
        message: error.message || "Network error",
      };
    }

    const axiosError = error;
    let errorMsg = "Something went wrong!";

    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        localStorage.removeItem("persist:fields");
        localStorage.removeItem("logiBriskUser");
        Cookies.remove("logibrisk");

        redirectTo("/login");
        return;
      }
      
      const responseData = axiosError.response.data;

      const logId = responseData?.message;
      if (logId) {
        // const containsNumber = /\d/.test(logId);

        // if (containsNumber) {
        //   window.location.href = `/error-report?errorLog=${encodeURIComponent(
        //     logId
        //   )}`;
        //   return;
        // } else {
        //   errorMsg = logId;
        // }
      }

      if (typeof responseData === "object" && responseData !== null) {
        errorMsg = responseData.errorDetail[0].errorMessage || errorMsg;
      }
    } else {
      errorMsg = axiosError.message || errorMsg;
    }

    if (showToast) {
      toast.error(errorMsg);
    }

    return {
      success: false,
      error: "api",
      message: errorMsg,
    };
  }
};

export default apiRequest;