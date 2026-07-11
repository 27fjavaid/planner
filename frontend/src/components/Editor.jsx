import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function Editor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content]);

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}