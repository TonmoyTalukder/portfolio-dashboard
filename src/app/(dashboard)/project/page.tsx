'use client';

import React, { useState, useEffect } from 'react';
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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';

import { IProject } from '@/src/types';
import {
  useCreateProject,
  useDeleteProject,
  useFetchProjects,
  useUpdateProject,
} from '@/src/hooks/project.hooks';

const ProjectsPage = () => {
  const { data: projectsData, isLoading, error } = useFetchProjects();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const fetchedProject = projectsData?.data;

  console.log('Fetched projects: ', fetchedProject);

  const [projects, setProjects] = useState<IProject[]>([]);
  const [search, setSearch] = useState('');
  const {
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
    onOpenChange: toggleCreateModal,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: openUpdateModal,
    onOpenChange: toggleUpdateModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: toggleDeleteModal,
  } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tags: '',
    imageUrl: '',
    link: '',
    frontend: '',
    backend: '',
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
      tags: newProject.tags.split(',').map((tag) => tag.trim()),
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
          title: '',
          description: '',
          tags: '',
          imageUrl: '',
          link: '',
          frontend: '',
          backend: '',
        });
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {/* Search Bar */}
      <input
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search projects..."
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Create New Project Button */}
      <Button className="mb-4" onPress={openCreateModal}>
        Create New Project
      </Button>

      {/* Projects Table */}
      <Table>
        <TableHeader>
          <TableColumn>Title</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Tags</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project, index) => (
            <TableRow key={index} className="hover:bg-gray-100">
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.tags.join(', ')}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Project Modal */}
      <Modal isOpen={isCreateModalOpen} onOpenChange={toggleCreateModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Project
              </ModalHeader>
              <ModalBody>
                <Input
                  required
                  label="Title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
                <Textarea
                  required
                  label="Description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  label="Tags (comma-separated)"
                  value={newProject.tags}
                  onChange={(e) =>
                    setNewProject({ ...newProject, tags: e.target.value })
                  }
                />
                <Input
                  label="Image URL"
                  value={newProject.imageUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, imageUrl: e.target.value })
                  }
                />
                <Input
                  label="Project Link"
                  value={newProject.link}
                  onChange={(e) =>
                    setNewProject({ ...newProject, link: e.target.value })
                  }
                />
                <Input
                  label="Frontend Repo"
                  value={newProject.frontend}
                  onChange={(e) =>
                    setNewProject({ ...newProject, frontend: e.target.value })
                  }
                />
                <Input
                  label="Backend Repo"
                  value={newProject.backend}
                  onChange={(e) =>
                    setNewProject({ ...newProject, backend: e.target.value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleCreateProject}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                  value={selectedProject?.title || ''}
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
                  value={selectedProject?.description || ''}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  label="Tags (comma-separated)"
                  value={selectedProject?.tags.join(', ') || ''}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      tags: e.target.value.split(',').map((tag) => tag.trim()),
                    })
                  }
                />
                <Input
                  label="Image URL"
                  value={selectedProject?.imageUrl || ''}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      imageUrl: e.target.value,
                    })
                  }
                />
                <Input
                  label="Project Link"
                  value={selectedProject?.link || ''}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      link: e.target.value,
                    })
                  }
                />
                <Input
                  label="Frontend Repo"
                  value={selectedProject?.frontend || ''}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject!,
                      frontend: e.target.value,
                    })
                  }
                />
                <Input
                  label="Backend Repo"
                  value={selectedProject?.backend || ''}
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete the project &quot;
                  {selectedProject?.title}&quot;?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleDeleteProject}>
                  Delete
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
