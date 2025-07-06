import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import useMemory from "@/core/store";

const EditorComponent = () => {
  const story = useMemory((state) => state.story);
  const setStory = useMemory((state) => state.setStory);

  const extensions = [StarterKit];

  const editor = useEditor({
    extensions,
    content: story,
    editorProps: {
      attributes: {
        class: "prose prose-sm m-0 focus:outline-none dark:prose-invert",
      },
    },
    autofocus: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setStory(html);
    },
  });

  return <EditorContent editor={editor} />;
};

export default EditorComponent;
