import { useState, useEffect } from "react";
import api from "../services/api";
import Editor from "./Editor";

export default function PageEditor({ page, onTitleChange }) {
  const [title, setTitle] = useState(page?.title === "Untitled" ? "" : page?.title || "");
  const [content, setContent] = useState(page?.content || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (page) {
      setTitle(page.title === "Untitled" ? "" : page.title || "");
      setContent(page.content || "");
    }
  }, [page]);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange(newTitle);
    await save(newTitle, content);
  };

  const handleContentChange = async (newContent) => {
    setContent(newContent);
    await save(title, newContent);
  };

  const save = async (newTitle, newContent) => {
    if (!page) return;
    setSaving(true);
    try {
      await api.patch(`/pages/${page.id}`, {
        title: newTitle,
        content: newContent,
      });
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setSaving(false);
    }
  };

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">Select a page or create a new one</p>
          <p className="text-sm">Use the sidebar to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto px-8 py-12 w-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-400">
          {saving ? "Saving..." : "Saved"}
        </span>
      </div>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.querySelector(".ProseMirror").focus();
  }
}}
        placeholder="Untitled"
        className="w-full text-4xl font-bold text-gray-800 border-none outline-none bg-transparent mb-4 placeholder-gray-300 leading-tight pb-1"      />
      <Editor content={content} onChange={handleContentChange} />
    </div>
  );
}