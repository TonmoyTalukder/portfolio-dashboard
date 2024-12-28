"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "@/src/lib/AxiosInstance";
import ApiError from "@/src/utils/error";
import { IUser } from "@/src/types";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    console.log("error: ", error);
    throw new Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    console.log("Logging user data: ", userData);
    console.log("API: ", process.env.NEXT_PUBLIC_BASE_API);
    const { data } = await axiosInstance.post("/auth/login", userData);

    console.log("Response Data: ", data);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      // cookies().set('refreshToken', data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const forgetPassword = async (email: string) => {
  try {
    const { data } = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        "An error occurred during password recovery.",
    );
  }
};

export const resetPassword = async (
  token: string,
  id: string,
  newPassword: string,
) => {
  try {
    const { data } = await axiosInstance.post(`/auth/reset-password/${token}`, {
      id,
      password: newPassword,
    });

    return data;
  } catch (error: any) {
    const status = error.response?.status || 500; // Default to 500 if no status
    const message =
      error.response?.data?.message || "An unexpected error occurred.";

    // Throwing an ApiError instance
    throw new ApiError(status, message);
  }
};

export const verify = async (email: string, code: string) => {
  try {
    const { data } = await axiosInstance.post(`/auth/verify`, {
      email,
      code,
    });

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      // cookies().set('refreshToken', data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status || 500; // Default to 500 if no status
    const message =
      error.response?.data?.message || "An unexpected error occurred.";

    // Throwing an ApiError instance
    throw new ApiError(status, message);
  }
};

export const changePassword = async (passwordData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(
      "/auth/change-password",
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
        },
        withCredentials: true,
      },
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to change password.",
    );
  }
};

export const logout = () => {
  const allCookies = cookies(); // Get all cookies

  if (!allCookies) return; // Ensure cookies are available

  // Delete specific tokens
  cookies().delete("accessToken");
  cookies().delete("refreshToken");

  // Delete all other cookies
  Object.keys(allCookies).forEach((cookieName) => {
    cookies().delete(cookieName);
  });
};

export const getCurrentUser = async () => {
  try {
    // Get the accessToken from cookies
    let accessToken = cookies().get("accessToken")?.value;

    if (!accessToken) {
      // Try refreshing the token
      const response = await axiosInstance.post("/refresh-token");

      accessToken = response.data?.data?.accessToken;

      if (accessToken) {
        // Store the new token (ensure your environment supports this)
        cookies().set("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      } else {
        return null; // Return null if token refresh fails
      }
    }

    // Decode the token (add validation on the server-side)
    const decodedToken = jwtDecode<IUser>(accessToken);

    // Extract user details
    const userData = {
      id: decodedToken.id,
      email: decodedToken.email,
    };

    return userData;
  } catch (error: any) {
    console.error("Failed to get current user:", error.message);

    return null;
  }
};
