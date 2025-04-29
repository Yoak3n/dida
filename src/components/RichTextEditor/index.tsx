import React from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { CustomTaskList, CustomTaskItem } from './editor'
import { Extension } from '@tiptap/core'

// 创建一个扩展来添加键盘快捷键
const CustomKeyboardShortcuts = Extension.create({
  name: 'customKeyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      'Tab': () => {
        return this.editor.chain().focus().command(({ commands }) => {
          return (commands as any).increaseNestingLevel()
        }).run()
      },
      'Shift-Tab': () => {
        return this.editor.chain().focus().command(({ commands }) => {
          return (commands as any).decreaseNestingLevel()
        }).run()
      }
    }
  }
})

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false, // 禁用默认的无序列表，使用我们的自定义任务列表
      }),
      CustomTaskList,
      CustomTaskItem,
      CustomKeyboardShortcuts, // 添加我们的自定义键盘快捷键扩展
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  })

  return (
    <div className="rich-text-editor">
      <EditorContent editor={editor} />
      <div className="editor-toolbar">
        <button
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
          className={editor?.isActive('customTaskList') ? 'is-active' : ''}
        >
          任务列表
        </button>
      </div>
    </div>
  )
}

export default RichTextEditor