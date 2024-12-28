'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState, useEffect } from 'react';

import MenuBar from './Menubar';

import {
  useCreateBlog,
  useDeleteBlog,
  useFetchBlogs,
  useUpdateBlog,
} from '@/src/hooks/blog.hooks';
import { IBlog } from '@/src/types';
import './styles.css';

const BlogPage = () => {
  const { data: blogsData, isLoading } = useFetchBlogs();
  const fetchedBlogs = blogsData?.data || [];
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchText, setSearchText] = useState('');
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your content here...' }),
      TextStyle,
      Highlight.configure({
        multicolor: true, // Enable multicolor highlighting if needed
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
    ],
    content: '',
    editorProps: {
      handleDOMEvents: {
        beforeinput: () => false, // Prevent SSR issues
      },
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        class:
          'prose prose-lg max-w-none min-h-[90px] overflow-y-auto focus:outline-none', // Customize height and styling here
      },
    },
    immediatelyRender: false,
    onUpdate({ editor }) {
      const content = editor.getHTML();

      if (selectedBlog && selectedBlog.text !== content) {
        setSelectedBlog((prev) => (prev ? { ...prev, text: content } : null));
      }
    },
  });

  useEffect(() => {
    if (JSON.stringify(blogs) !== JSON.stringify(fetchedBlogs)) {
      setBlogs(fetchedBlogs);
    }
  }, [fetchedBlogs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();

    setSearchText(searchValue);
    const filteredBlogs = fetchedBlogs.filter(
      (blog: IBlog) =>
        blog.title.toLowerCase().includes(searchValue) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchValue)),
    );

    setBlogs(filteredBlogs);
  };

  const handleDelete = async (blogId: string) => {
    await deleteBlogMutation.mutateAsync(blogId);
  };

  const handleCreateOrUpdate = async () => {
    const tagsArray = tags.split(',').map((tag) => tag.trim());
    const blogData = {
      title,
      tags: tagsArray,
      coverImage,
      text: editor?.getHTML() || '',
    };

    if (selectedBlog) {
      await updateBlogMutation.mutateAsync({
        blogId: selectedBlog._id!,
        updatedData: blogData,
      });
    } else {
      await createBlogMutation.mutateAsync(blogData);
    }

    onOpenChange();
    resetForm();
  };

  const handleOpenModal = (blog?: IBlog) => {
    setSelectedBlog(blog || null);
    setTitle(blog?.title || '');
    setTags(blog?.tags.join(', ') || '');
    setCoverImage(blog?.coverImage || '');
    if (editor) {
      editor.commands.setContent(blog?.text || '');
    }
    onOpen();
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setTitle('');
    setTags('');
    setCoverImage('');
    editor?.commands.setContent('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Management</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          aria-label="Search blogs"
          className="w-full max-w-md"
          placeholder="Search blogs by title or tags"
          value={searchText}
          onChange={handleSearch}
        />
        <Button
          className="ml-4"
          color="primary"
          onPress={() => handleOpenModal()}
        >
          Create Blog
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>Title</TableColumn>
          <TableColumn>Tags</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog._id}>
              <TableCell>{blog.title}</TableCell>
              <TableCell>
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </TableCell>
              <TableCell>
                <Button onPress={() => handleOpenModal(blog)}>Edit</Button>
                <Button color="danger" onPress={() => handleDelete(blog._id!)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-h-[90vh] overflow-hidden">
          {(onClose) => (
            <>
              <ModalHeader className="sticky top-0 z-10">
                {selectedBlog ? 'Update Blog' : 'Create New Blog'}
              </ModalHeader>
              <ModalBody className="overflow-y-auto max-h-[70vh]">
                <Input
                  aria-label="Blog Title"
                  className="mb-4"
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  aria-label="Tags"
                  className="mb-4"
                  placeholder="Tags (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <Input
                  aria-label="Cover Image URL"
                  className="mb-4"
                  placeholder="Cover Image URL"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                <div className="m-8">
                  <MenuBar editor={editor} />
                  <div className="border border-gray-300 p-4 rounded-md mt-4">
                    <EditorContent editor={editor} className="min-h-[200px]" />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="sticky bottom-0 z-10">
                <Button onPress={onClose}>Close</Button>
                <Button color="primary" onPress={handleCreateOrUpdate}>
                  {selectedBlog ? 'Update Blog' : 'Save Blog'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BlogPage;
