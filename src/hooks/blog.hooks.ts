import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";

import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from "../services/BlogService";

// Create Blog Hook
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["CREATE_BLOG"],
    mutationFn: async (blogData: FieldValues) => {
      console.log("Sending blog data:", blogData);
      const response = await createBlog(blogData);

      console.log("Response from server:", response);

      return response;
    },
    onSuccess: () => {
      toast.success("Blog created successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_BLOGS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the blog.",
      );
      console.error("Error creating blog:", error);
    },
  });
};

// Fetch Blogs Hook
export const useFetchBlogs = () => {
  return useQuery({
    queryKey: ["FETCH_BLOGS"], // Unique key for caching
    queryFn: async () => {
      try {
        const data = await getBlogs(); // Call the service function to fetch blogs

        console.log("Fetched blogs data:", data); // Log the fetched data

        return data; // Return the fetched data
      } catch (error) {
        console.error("Error fetching blogs:", error); // Log the error
        toast.error("Failed to fetch blogs."); // Show error toast notification
        throw error; // Rethrow the error to let react-query handle it
      }
    },
  });
};

// Update Blog Hook
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { blogId: string; updatedData: FieldValues }>({
    mutationKey: ["UPDATE_BLOG"],
    mutationFn: async ({ blogId, updatedData }) => {
      console.log("Updating blog with ID:", blogId);
      const response = await updateBlog(blogId, updatedData);

      console.log("Response from server:", response);

      return response;
    },
    onSuccess: () => {
      toast.success("Blog updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_BLOGS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while updating the blog.",
      );
      console.error("Error updating blog:", error);
    },
  });
};

// Delete Blog Hook
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationKey: ["DELETE_BLOG"],
    mutationFn: async (blogId: string) => {
      console.log("Deleting blog with ID:", blogId);
      await deleteBlog(blogId);
    },
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_BLOGS"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while deleting the blog.",
      );
      console.error("Error deleting blog:", error);
    },
  });
};
