import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";

import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../services/SkillService";

// Create Skill Hook
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["CREATE_SKILL"],
    mutationFn: async (skillData: FieldValues) => {
      console.log("Sending skill data:", skillData);
      const response = await createSkill(skillData);

      console.log("Response from server:", response);

      return response;
    },
    onSuccess: () => {
      toast.success("Skill created successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_SKILLS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the skill.",
      );
      console.error("Error creating skill:", error);
    },
  });
};

// Fetch Skills Hook
export const useFetchSkills = () => {
  return useQuery({
    queryKey: ["FETCH_SKILLS"], // Unique key for caching
    queryFn: async () => {
      try {
        const data = await getSkills(); // Call the service function to fetch skills

        console.log("Fetched skills data:", data); // Log the fetched data

        return data; // Return the fetched data
      } catch (error) {
        console.error("Error fetching skills:", error); // Log the error
        toast.error("Failed to fetch skills."); // Show error toast notification
        throw error; // Rethrow the error to let react-query handle it
      }
    },
  });
};

// Update Skill Hook
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { skillId: string; updatedData: FieldValues }>(
    {
      mutationKey: ["UPDATE_SKILL"],
      mutationFn: async ({ skillId, updatedData }) => {
        console.log("Updating skill with ID:", skillId);
        const response = await updateSkill(skillId, updatedData);

        console.log("Response from server:", response);

        return response;
      },
      onSuccess: () => {
        toast.success("Skill updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["FETCH_SKILLS"] });
      },
      onError: (error) => {
        toast.error(
          error.message || "An error occurred while updating the skill.",
        );
        console.error("Error updating skill:", error);
      },
    },
  );
};

// Delete Skill Hook
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationKey: ["DELETE_SKILL"],
    mutationFn: async (skillId: string) => {
      console.log("Deleting skill with ID:", skillId);
      await deleteSkill(skillId);
    },
    onSuccess: () => {
      toast.success("Skill deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_SKILLS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while deleting the skill.",
      );
      console.error("Error deleting skill:", error);
    },
  });
};
