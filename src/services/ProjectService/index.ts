"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";
import { IProject } from "@/src/types";

export const createProject = async (
  postData: FieldValues,
): Promise<IProject> => {
  try {
    console.log("axiosInstance : ", axiosInstance);
    const { data } = await axiosInstance.post<IProject>(`/project`, postData);

    return data;
  } catch (error: any) {
    console.error(
      "Error creating project:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to create project. Please try again.",
    );
  }
};

export const getProjects = async () => {
  try {
    const { data } = await axiosInstance.get(`/project`);

    if (data.success) {
      console.log("Project data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateProject = async (
  projectId: string,
  updatedData: FieldValues,
): Promise<IProject> => {
  try {
    const { data } = await axiosInstance.put<IProject>(
      `/project/${projectId}`,
      updatedData,
    );

    console.log("Updated project => ", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error updating project:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update project. Please try again.",
    );
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/project/${projectId}`);

    console.log("Deleted project with ID:", projectId);
  } catch (error: any) {
    console.error(
      "Error deleting project:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete project. Please try again.",
    );
  }
};
