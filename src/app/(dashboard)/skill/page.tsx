'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { toast } from 'sonner';

import { ISkill } from '@/src/types';
import {
  useCreateSkill,
  useDeleteSkill,
  useFetchSkills,
  useUpdateSkill,
} from '@/src/hooks/skill.hooks';

const SkillPage = () => {
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // React Query hooks
  const { data: skills, isLoading, isError } = useFetchSkills();
  const createSkillMutation = useCreateSkill();
  const updateSkillMutation = useUpdateSkill();
  const deleteSkillMutation = useDeleteSkill();

  const handleCreateSkill = () => {
    if (!newSkill.trim()) {
      toast.error('Skill name cannot be empty.');

      return;
    }

    createSkillMutation.mutate(
      { name: newSkill.trim() },
      {
        onSuccess: () => {
          setNewSkill('');
          onOpenChange();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create skill.');
        },
      },
    );
  };

  const handleDeleteSkill = (skillId: string) => {
    deleteSkillMutation.mutate(skillId, {
      onError: (error) => {
        toast.error(error.message || 'Failed to delete skill.');
      },
    });
  };

  const handleEditSkill = (updatedSkill: ISkill) => {
    if (!editingSkill) return;

    updateSkillMutation.mutate(
      { skillId: editingSkill._id!, updatedData: updatedSkill },
      {
        onSuccess: () => {
          setEditingSkill(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update skill.');
        },
      },
    );
  };

  if (isLoading) return <p>Loading skills...</p>;
  if (isError) return <p>Error loading skills. Please try again later.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Skills</h1>

      {/* Create New Skill Button */}
      <Button className="mb-4" onPress={onOpen}>
        Create New Skill
      </Button>

      {/* Skills Table */}

      <Table>
        <TableHeader>
          <TableColumn>Skill Name</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {skills?.map((skill: ISkill) => (
            <TableRow key={skill._id} className="hover:bg-gray-100">
              <TableCell>
                {editingSkill?._id === skill._id ? (
                  <Input
                    value={editingSkill?.name}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, name: e.target.value })
                    }
                  />
                ) : (
                  skill.name
                )}
              </TableCell>
              <TableCell>
                {editingSkill?._id === skill._id ? (
                  <>
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => handleEditSkill(editingSkill!)}
                    >
                      Save
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => setEditingSkill(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => setEditingSkill(skill)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleDeleteSkill(skill._id!)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Skill Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Skill</ModalHeader>
              <ModalBody>
                <Input
                  label="Skill Name"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleCreateSkill}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SkillPage;
