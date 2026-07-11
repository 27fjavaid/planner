import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import PageEditor from "../components/PageEditor";

export default function Dashboard() {
  const [activePage, setActivePage] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePageSelect = (page) => {
    setActivePage(page);
  };

  const handleNewPage = (page) => {
    setActivePage(page);
  };

  const handleTitleChange = (newTitle) => {
    setActivePage((prev) => ({ ...prev, title: newTitle }));
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        activePage={activePage}
        onPageSelect={handlePageSelect}
        onNewPage={handleNewPage}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex justify-end p-3 border-b border-gray-200">
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Logout
          </button>
        </div>
        <PageEditor page={activePage} onTitleChange={handleTitleChange} />
      </div>
    </div>
  );
}