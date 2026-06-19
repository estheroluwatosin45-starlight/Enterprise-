'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Redo, Undo } from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 flex-wrap rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Bold"
        type="button"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Italic"
        type="button"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Heading 2"
        type="button"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Quote"
        type="button"
      >
        <Quote className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Bullet List"
        type="button"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Numbered List"
        type="button"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-50 transition-colors"
        title="Undo"
        type="button"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-50 transition-colors"
        title="Redo"
        type="button"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function TipTapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-none focus:outline-none min-h-[400px] p-6 bg-white rounded-b-xl',
      },
    },
  });

  return (
    <div className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
