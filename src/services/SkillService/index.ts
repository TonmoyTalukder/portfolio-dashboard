"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";
import { ISkill } from "@/src/types";

export const createSkill = async (postData: FieldValues): Promise<ISkill> => {
  try {
    console.log("axiosInstance : ", axiosInstance);
    const { data } = await axiosInstance.post<ISkill>(`/skill`, postData);

    return data;
  } catch (error: any) {
    console.error(
      "Error creating skill:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to create skill. Please try again.",
    );
  }
};

export const getSkills = async () => {
  try {
    const { data } = await axiosInstance.get(`/skill`);

    if (data.success) {
      console.log("Skill data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateSkill = async (
  skillId: string,
  updatedData: FieldValues,
): Promise<ISkill> => {
  try {
    const { data } = await axiosInstance.put<ISkill>(
      `/skill/${skillId}`,
      updatedData,
    );

    console.log("Updated skill => ", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error updating skill:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update skill. Please try again.",
    );
  }
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/skill/${skillId}`);

    console.log("Deleted skill with ID:", skillId);
  } catch (error: any) {
    console.error(
      "Error deleting skill:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete skill. Please try again.",
    );
  }
};
