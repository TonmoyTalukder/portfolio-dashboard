"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";
import { IBlog } from "@/src/types";

export const createBlog = async (postData: FieldValues): Promise<IBlog> => {
  try {
    console.log("axiosInstance : ", axiosInstance);
    const { data } = await axiosInstance.post<IBlog>(`/blog`, postData);

    return data;
  } catch (error: any) {
    console.error(
      "Error creating blog:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to create blog. Please try again.",
    );
  }
};

export const getBlogs = async () => {
  try {
    const { data } = await axiosInstance.get(`/blog`);

    if (data.success) {
      console.log("Blog data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateBlog = async (
  blogId: string,
  updatedData: FieldValues,
): Promise<IBlog> => {
  try {
    const { data } = await axiosInstance.put<IBlog>(
      `/blog/${blogId}`,
      updatedData,
    );

    console.log("Updated blog => ", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error updating blog:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update blog. Please try again.",
    );
  }
};

export const deleteBlog = async (blogId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/blog/${blogId}`);

    console.log("Deleted blog with ID:", blogId);
  } catch (error: any) {
    console.error(
      "Error deleting blog:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete blog. Please try again.",
    );
  }
};
