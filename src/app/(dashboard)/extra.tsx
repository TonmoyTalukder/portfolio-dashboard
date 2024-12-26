"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";

import { IProject } from "@/src/types";
import {
  useCreateProject,
  useDeleteProject,
  useFetchProjects,
  useUpdateProject,
} from "@/src/hooks/project.hooks";

const ProjectsPage = () => {
  const { data: projectsData, isLoading, error } = useFetchProjects();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const fetchedProject = projectsData?.data;

  console.log("Fetched projects: ", fetchedProject);

  const [projects, setProjects] = useState<IProject[]>([]);
  const [search, setSearch] = useState("");
  const {
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
    onOpenChange: toggleCreateModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: toggleDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: openUpdateModal,
    onOpenChange: toggleUpdateModal,
  } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "",
    imageUrl: "",
    link: "",
    frontend: "",
    backend: "",
  });

  useEffect(() => {
    if (fetchedProject) {
      setProjects(fetchedProject);
    }
  }, [fetchedProject]);

  const filteredProjects = Array.isArray(projects)
    ? projects.filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const handleCreateProject = async () => {
    const projectPayload = {
      title: newProject.title,
      description: newProject.description,
      tags: newProject.tags.split(",").map((tag) => tag.trim()),
      imageUrl: newProject.imageUrl,
      link: newProject.link,
      frontend: newProject.frontend,
      backend: newProject.backend,
    };

    createProjectMutation.mutate(projectPayload, {
      onSuccess: (createdProject) => {
        setProjects((prev) =>
          Array.isArray(prev) ? [createdProject, ...prev] : [createdProject],
        );
        toggleCreateModal();
        setNewProject({
          title: "",
          description: "",
          tags: "",
          imageUrl: "",
          link: "",
          frontend: "",
          backend: "",
        });
      },
    });
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    deleteProjectMutation.mutate(selectedProject._id!, {
      onSuccess: () => {
        setProjects((prev) =>
          prev.filter((p) => p._id !== selectedProject._id),
        );
        toggleDeleteModal();
      },
    });
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;

    const updatedPayload = {
      title: selectedProject.title,
      description: selectedProject.description,
      tags: selectedProject.tags,
      imageUrl: selectedProject.imageUrl,
      link: selectedProject.link,
      frontend: selectedProject.frontend,
      backend: selectedProject.backend,
    };

    updateProjectMutation.mutate(
      { projectId: selectedProject._id!, updatedData: updatedPayload },
      {
        onSuccess: (updatedProject) => {
          setProjects((prev) =>
            prev.map((project) =>
              project._id === updatedProject._id ? updatedProject : project,
            ),
          );
          toggleUpdateModal();
        },
      },
    );
  };

  return (
    <div className="p-6">
      {/* Add Update Project Button to each project */}
      <table className="w-full border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-blue-100">
            <th className="border border-gray-300 p-4 text-left">Title</th>
            <th className="border border-gray-300 p-4 text-left">
              Description
            </th>
            <th className="border border-gray-300 p-4 text-left">Tags</th>
            <th className="border border-gray-300 p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-4">{project.title}</td>
              <td className="border border-gray-300 p-4">
                {project.description}
              </td>
              <td className="border border-gray-300 p-4">
                {project.tags.join(", ")}
              </td>
              <td className="border border-gray-300 p-4 text-center">
                <Button
                  onPress={() => {
                    setSelectedProject(project);
                    openUpdateModal();
                  }}
                >
                  Update
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    setSelectedProject(project);
                    openDeleteModal();
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Project Modal */}
      <Modal isOpen={isUpdateModalOpen} onOpenChange={toggleUpdateModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Project
              </ModalHeader>
              <ModalBody>
                <Input
                  required
                  label="Title"
                  value={selectedProject?.title || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      title: e.target.value,
                    })
                  }
                />
                <Textarea
                  required
                  label="Description"
                  value={selectedProject?.description || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  label="Tags (comma-separated)"
                  value={selectedProject?.tags.join(", ") || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                />
                <Input
                  label="Image URL"
                  value={selectedProject?.imageUrl || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      imageUrl: e.target.value,
                    })
                  }
                />
                <Input
                  label="Project Link"
                  value={selectedProject?.link || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      link: e.target.value,
                    })
                  }
                />
                <Input
                  label="Frontend Repo"
                  value={selectedProject?.frontend || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      frontend: e.target.value,
                    })
                  }
                />
                <Input
                  label="Backend Repo"
                  value={selectedProject?.backend || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      backend: e.target.value,
                    })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleUpdateProject}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
