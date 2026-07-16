import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
const COLUMNS = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
];

const PRIORITIES = { LOW: "🟢", MEDIUM: "🟡", HIGH: "🔴" };

export default function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "MEDIUM" });
  const [draggedTask, setDraggedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const res = await api.post("/tasks", newTask);
      setTasks((prev) => [...prev, res.data]);
      setNewTask({ title: "", description: "", priority: "MEDIUM" });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const res = await api.patch(`/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleDragStart = (task) => setDraggedTask(task);

  const handleDrop = (status) => {
    if (draggedTask && draggedTask.status !== status) {
      updateStatus(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            ← Back
          </button>
         <h1 className="text-2xl font-semibold text-gray-800">To Do List</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          + New Task
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">New Task</h2>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={createTask}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
            className="bg-gray-50 rounded-xl p-4 min-h-96"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-600">{col.label}</h2>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                {getTasksByStatus(col.id).length}
              </span>
            </div>
            <div className="space-y-2">
              {getTasksByStatus(col.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-800 font-medium">{task.title}</p>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs transition"
                    >
                      ✕
                    </button>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  )}
                  <div className="mt-2">
                    <span className="text-xs">{PRIORITIES[task.priority]} {task.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}