import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";

import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../services/ProjectService";

// Create Project Hook
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["CREATE_PROJECT"],
    mutationFn: async (projectData: FieldValues) => {
      console.log("Sending project data:", projectData);
      const response = await createProject(projectData);

      console.log("Response from server:", response);

      return response;
    },
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_PROJECTS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the project.",
      );
      console.error("Error creating project:", error);
    },
  });
};

// Fetch Projects Hook
export const useFetchProjects = () => {
  return useQuery({
    queryKey: ["FETCH_PROJECTS"], // Unique key for caching
    queryFn: async () => {
      try {
        const data = await getProjects(); // Call the service function to fetch projects

        console.log("Fetched projects data:", data); // Log the fetched data

        return data; // Return the fetched data
      } catch (error) {
        console.error("Error fetching projects:", error); // Log the error
        toast.error("Failed to fetch projects."); // Show error toast notification
        throw error; // Rethrow the error to let react-query handle it
      }
    },
  });
};

// Update Project Hook
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { projectId: string; updatedData: FieldValues }
  >({
    mutationKey: ["UPDATE_PROJECT"],
    mutationFn: async ({ projectId, updatedData }) => {
      console.log("Updating project with ID:", projectId);
      const response = await updateProject(projectId, updatedData);

      console.log("Response from server:", response);

      return response;
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_PROJECTS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while updating the project.",
      );
      console.error("Error updating project:", error);
    },
  });
};

// Delete Project Hook
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationKey: ["DELETE_PROJECT"],
    mutationFn: async (projectId: string) => {
      console.log("Deleting project with ID:", projectId);
      await deleteProject(projectId);
    },
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_PROJECTS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while deleting the project.",
      );
      console.error("Error deleting project:", error);
    },
  });
};
