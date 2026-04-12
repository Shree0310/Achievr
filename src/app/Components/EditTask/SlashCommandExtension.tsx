import { Extension } from '@tiptap/core'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import SlashCommandMenu, {
  SlashCommandMenuRef,
  getSlashCommandItems,
} from './SlashCommandMenu'

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      } as Partial<SuggestionOptions>,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export const slashCommandSuggestion: Partial<SuggestionOptions> = {
  items: ({ query, editor }) => {
    const items = getSlashCommandItems(editor)
    return items.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    )
  },

  render: () => {
    let component: ReactRenderer<SlashCommandMenuRef>
    let popup: TippyInstance[]

    const executeCommand = (props: any, item: any) => {
      const { editor, range } = props

      // Delete the slash and any query text first
      editor.chain().focus().deleteRange(range).run()

      // Then execute the command
      item.command(editor)

      // Destroy popup to close menu
      if (popup && popup[0]) {
        popup[0].destroy()
      }
    }

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashCommandMenu, {
          props: {
            items: props.items,
            command: (item: any) => executeCommand(props, item),
          },
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component?.updateProps({
          items: props.items,
          command: (item: any) => executeCommand(props, item),
        })

        if (!props.clientRect) {
          return
        }

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup?.[0]?.hide()
          return true
        }

        return component?.ref?.onKeyDown(props) ?? false
      },

      onExit() {
        popup?.[0]?.destroy()
        component?.destroy()
      },
    }
  },
}
