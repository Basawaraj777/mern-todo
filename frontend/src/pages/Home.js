import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { token, logout } = useAuth();

  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTodos = async () => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    setLoading(true);
    try {
      const axiosAuth = axiosInstance(token);
      const response = await axiosAuth.get("/todo");
      setTodos(response.data);
    } catch (err) {
      console.error("Fetch todos error:", err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized – please login");
      } else if (err.response?.status === 404) {
        toast.error("Route not found (404)");
      } else {
        toast.error("Failed to fetch todos");
      }
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) {
      toast.warn("Title is required");
      return;
    }

    const payload = {
      title: newTitle,
      description,
      status,
      dueDate: dueDate || null,
    };

    try {
      const axiosAuth = axiosInstance(token);
      await axiosAuth.post("/todo", payload);
      toast.success("Todo added successfully!");
      setNewTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");
      setShowAddForm(false);
      fetchTodos();
    } catch (err) {
      console.error("Add todo error:", err);
      toast.error("Failed to add todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const axiosAuth = axiosInstance(token);
      await axiosAuth.delete(`/todo/${id}`);
      toast.success("Todo deleted!");
      fetchTodos();
    } catch (err) {
      console.error("Delete todo error:", err);
      toast.error("Failed to delete");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      const axiosAuth = axiosInstance(token);
      await axiosAuth.post(`/todo/${id}`, { status: newStatus });
      toast.success(`Todo marked as ${newStatus}!`);
      fetchTodos();
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("Failed to update status");
    }
  };

  // Filter and search todos
  useEffect(() => {
    let filtered = todos;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((todo) => todo.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTodos(filtered);
  }, [todos, filter, searchTerm]);

  useEffect(() => {
    if (token) {
      fetchTodos();
    } else {
      toast.error("You are not authenticated");
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "🔄";
      default:
        return "⏳";
    }
  };

  const statsData = {
    total: todos.length,
    completed: todos.filter((todo) => todo.status === "completed").length,
    pending: todos.filter((todo) => todo.status === "pending").length,
    inProgress: todos.filter((todo) => todo.status === "in-progress").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                📝{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TodoMaster
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-sm text-gray-600">Welcome back! 👋</span>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statsData.total}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {statsData.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {statsData.inProgress}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {statsData.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "in-progress", "completed"].map(
                (filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                      filter === filterOption
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filterOption.charAt(0).toUpperCase() +
                      filterOption.slice(1).replace("-", " ")}
                  </button>
                )
              )}
            </div>

            {/* Add Todo Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md font-medium"
            >
              {showAddForm ? "Cancel" : "➕ Add Todo"}
            </button>
          </div>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg border p-6 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Todo
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Todo title *"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addTodo}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Create Todo"}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading todos...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {todos.length === 0
                  ? "No todos yet"
                  : "No todos match your filter"}
              </h3>
              <p className="text-gray-600">
                {todos.length === 0
                  ? "Create your first todo to get started!"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200 ${
                  todo.status === "completed" ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {getStatusIcon(todo.status)}
                      </span>
                      <h3
                        className={`text-lg font-semibold ${
                          todo.status === "completed"
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          todo.status
                        )}`}
                      >
                        {todo.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    {todo.description && (
                      <p className="text-gray-600 mb-3 ml-11">
                        {todo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 ml-11 text-sm text-gray-500">
                      {todo.dueDate && (
                        <span className="flex items-center gap-1">
                          📅 Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        🕒 Created:{" "}
                        {new Date(
                          todo.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleStatus(todo._id, todo.status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        todo.status === "completed"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {todo.status === "completed" ? "↩️ Undo" : "✅ Complete"}
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
