import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Box, Stack } from "@mantine/core";
import {
  IconNote,
  IconPencil,
  IconPencilOff,
  IconSquareRounded,
  IconSquareRoundedCheck,
} from "@tabler/icons-react";
import { WidgetDefinition } from "../types.ts";
import { OptionalWidgetHeader } from "../components/atoms/optional-widget-header.tsx";

export const notesWidget: WidgetDefinition<
  { content: string; showControls: boolean; canEdit: boolean },
  undefined
> = {
  name: "Notes",
  IconComponent: IconNote,
  label: "A simple notes editor",
  description: [
    "This widget allows you to write and format text.",
    "The editor supports rich-text formatting.",
    "You can toggle the toolbar and the ability to edit the text.",
  ],
  default: {
    title: "",
    content: "",
    showControls: true,
    canEdit: true,
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  DisplayComponent: ({ config, onChange, icon }) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      content: config.content,
      onBlur: (update) => {
        onChange({ content: update.editor.getHTML() });
      },
    });

    if (!config.canEdit) {
      return (
        <>
          {" "}
          <OptionalWidgetHeader title={config.title} icon={icon} />
          <div
            style={{ overflow: "auto", height: "100%" }}
            dangerouslySetInnerHTML={{ __html: config.content }}
          />
        </>
      );
    }

    return (
      <RichTextEditor editor={editor} bd="unset" style={{ height: "100%" }}>
        <Stack h="100%">
          <OptionalWidgetHeader title={config.title} icon={icon} />
          {config.showControls && (
            <RichTextEditor.Toolbar>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
          )}

          <Box style={{ flexGrow: "1", overflow: "auto", maxHeight: "100%" }}>
            <RichTextEditor.Content />
          </Box>
        </Stack>
      </RichTextEditor>
    );
  },
  iconActions: [
    {
      icon: ({ config }) =>
        config.canEdit ? <IconPencil /> : <IconPencilOff />,
      text: "Toggle can edit",
      action: (props) => props.onChange({ canEdit: !props.config.canEdit }),
    },
  ],
  menuActions: [
    {
      text: "Can edit",
      action: ({ config, onChange }) => {
        onChange({ canEdit: !config.canEdit });
      },
      icon: ({ config }) =>
        config.canEdit ? <IconSquareRoundedCheck /> : <IconSquareRounded />,
    },
    {
      text: "Show toolbar",
      action: ({ config, onChange }) => {
        onChange({ showControls: !config.showControls });
      },
      icon: ({ config }) =>
        config.showControls ? (
          <IconSquareRoundedCheck />
        ) : (
          <IconSquareRounded />
        ),
    },
  ],
};
