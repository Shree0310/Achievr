'use client'

import { Editor } from '@tiptap/react'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Code,
  Minus
} from 'lucide-react'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'

export interface SlashCommandItem {
  title: string
  description: string
  icon: React.ReactNode
  command: (editor: Editor) => void
}

interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export interface SlashCommandMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const SlashCommandMenu = forwardRef<SlashCommandMenuRef, SlashCommandMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length)
          return true
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length)
          return true
        }

        if (event.key === 'Enter') {
          const item = items[selectedIndex]
          if (item) {
            command(item)
          }
          return true
        }

        return false
      },
    }))

    return (
      <div className="z-50 bg-white dark:bg-neutral-900/70 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden min-w-[280px]">
        {items.length > 0 ? (
          items.map((item, index) => (
            <button
              key={index}
              onClick={() => command(item)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                index === selectedIndex
                  ? 'bg-neutral-100 dark:bg-neutral-700'
                  : ''
              }`}
            >
              <div className="mt-0.5 text-neutral-600 dark:text-neutral-400">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.description}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
            No results
          </div>
        )}
      </div>
    )
  }
)

SlashCommandMenu.displayName = 'SlashCommandMenu'

export default SlashCommandMenu

// Predefined slash command items
export const getSlashCommandItems = (editor: Editor): SlashCommandItem[] => [
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 size={18} />,
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 size={18} />,
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Heading3 size={18} />,
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run()
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a bullet list',
    icon: <List size={18} />,
    command: (editor) => {
      editor.chain().focus().toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: <ListOrdered size={18} />,
    command: (editor) => {
      editor.chain().focus().toggleOrderedList().run()
    },
  },
  {
    title: 'Quote',
    description: 'Add a blockquote',
    icon: <Quote size={18} />,
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().run()
    },
  },
  {
    title: 'Code Block',
    description: 'Add a code block',
    icon: <Code size={18} />,
    command: (editor) => {
      editor.chain().focus().toggleCodeBlock().run()
    },
  },
  {
    title: 'Divider',
    description: 'Add a horizontal rule',
    icon: <Minus size={18} />,
    command: (editor) => {
      editor.chain().focus().setHorizontalRule().run()
    },
  },
  {
    title: 'Image',
    description: 'Insert an image from URL',
    icon: <ImageIcon size={18} />,
    command: (editor) => {
      const url = window.prompt('Enter image URL:')
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },
]
