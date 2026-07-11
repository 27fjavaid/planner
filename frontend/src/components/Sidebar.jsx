import { useState, useEffect } from "react";
import api from "../services/api";

export default function Sidebar({ activePage, onPageSelect, onNewPage }) {
  const [pages, setPages] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchRootPages();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRootPages();
    }, 500);
    return () => clearTimeout(timer);
  }, [activePage?.title]);

  const fetchRootPages = async () => {
    try {
      const res = await api.get("/pages");
      setPages(res.data);
    } catch (err) {
      console.error("Failed to fetch pages", err);
    }
  };

  const toggleExpand = async (pageId) => {
    setExpanded((prev) => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const handleNewPage = async (parentPageId = null) => {
    try {
      const body = parentPageId ? { parentPageId } : {};
      const res = await api.post("/pages", body);
      onNewPage(res.data);
      fetchRootPages();
    } catch (err) {
      console.error("Failed to create page", err);
    }
  };

  const renderPage = (page, depth = 0) => (
    <div key={page.id}>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer group hover:bg-gray-100 ${
          activePage?.id === page.id ? "bg-gray-100" : ""
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <button
          onClick={() => toggleExpand(page.id)}
          className="text-gray-400 hover:text-gray-600 w-4 text-xs"
        >
          {expanded[page.id] ? "▼" : "▶"}
        </button>
        <span
          onClick={() => onPageSelect(page)}
          className="flex-1 text-sm text-gray-700 truncate"
        >
          {page.title || "Untitled"}
        </span>
        <button
          onClick={() => handleNewPage(page.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 text-xs px-1"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-800">My Planner</h1>
        <a
          href="/kanban"
          className="flex items-center gap-2 mt-3 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-100 px-2 py-1.5 rounded-lg transition"
        >
          📋 Kanban Board
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {pages.map((page) => renderPage(page))}
      </div>
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => handleNewPage()}
          className="w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 py-1.5 rounded-lg transition text-left px-2"
        >
          + New page
        </button>
      </div>
    </div>
  );
}