import React from 'react';
import { Editor } from '@tiptap/react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaCode,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from 'react-icons/fa';
import { MdHighlight } from 'react-icons/md';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const applySize = (size: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  const applyHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 rounded-md shadow-md">
      {/* Bold */}
      <button
        aria-label="Toggle Bold"
        className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
          editor.isActive('bold')
            ? 'bg-blue-100 border-blue-500'
            : 'border-gray-300'
        } hover:bg-gray-200`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FaBold />
      </button>

      {/* Italic */}
      <button
        aria-label="Toggle Italic"
        className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
          editor.isActive('italic')
            ? 'bg-blue-100 border-blue-500'
            : 'border-gray-300'
        } hover:bg-gray-200`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FaItalic />
      </button>

      {/* Underline */}
      <button
        aria-label="Toggle Underline"
        className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
          editor.isActive('underline')
            ? 'bg-blue-100 border-blue-500'
            : 'border-gray-300'
        } hover:bg-gray-200`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FaUnderline />
      </button>

      {/* Code */}
      <button
        aria-label="Toggle Code"
        className={`px-4 py-2 rounded-md ${
          editor.isActive('code') && 'bg-blue-400'
        }`}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <FaCode />
      </button>

      {/* Highlight */}
      <Dropdown>
        <DropdownTrigger aria-label="Highlight Options">
          <Button variant="bordered">
            <MdHighlight />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Highlight Colors">
          {['yellow', 'green', 'pink', 'blue'].map((color) => (
            <DropdownItem
              key={color}
              aria-label={`Highlight with ${color}`}
              onClick={() =>
                editor?.chain().focus().toggleHighlight({ color }).run()
              }
            >
              <span
                className={`inline-block w-4 h-4 rounded-full`}
                style={{ backgroundColor: color }}
              />
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Paragraph */}
      {/* <button
        aria-label="Set Paragraph"
        className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
          editor.isActive('paragraph')
            ? 'bg-blue-400 border-blue-500'
            : 'border-gray-300'
        } hover:bg-gray-200`}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </button> */}

      {/* Heading Options */}
      <Dropdown>
        <DropdownTrigger aria-label="Heading Options">
          <Button variant="bordered">Heading</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Heading Levels">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <DropdownItem
              key={level}
              aria-label={`Set Heading to H${level}`}
              onClick={() => toggleHeading(level as 1 | 2 | 3 | 4 | 5 | 6)}
            >
              H{level}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Font Size Options */}
      {/* <Dropdown>
        <DropdownTrigger aria-label="Font Size Options">
          <Button variant="bordered">Font Size</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Font Sizes">
          {[
            { label: 'Extra Large', size: '32px' },
            { label: 'Large', size: '24px' },
            { label: 'Medium', size: '18px' },
            { label: 'Small', size: '14px' },
          ].map(({ label, size }) => (
            <DropdownItem
              key={size}
              aria-label={`Set Font Size to ${label}`}
              onClick={() => applySize(size)}
            >
              {label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown> */}

      {/* Text Alignment */}
      <button
        aria-label="Justify Text"
        className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <FaAlignJustify />
      </button>
      <button
        aria-label="Align Left"
        className="flex items-center gap-2 px-4 py-2 rounded-md  border border-gray-300 hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <FaAlignLeft />
      </button>
      <button
        aria-label="Align Center"
        className="flex items-center gap-2 px-4 py-2 rounded-md  border border-gray-300 hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <FaAlignCenter />
      </button>
      <button
        aria-label="Align Right"
        className="flex items-center gap-2 px-4 py-2 rounded-md  border border-gray-300 hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <FaAlignRight />
      </button>
    </div>
  );
};

export default MenuBar;
