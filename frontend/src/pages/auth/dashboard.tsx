import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { taskAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import type { Task } from "@/types/type";
import Header from "../../components/shared/header";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(
    "pending"
  );
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.getTasks();
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDueDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask.id, {
          title,
          description,
          status,
          due_date: dueDate || undefined,
        });
      } else {
        await taskAPI.createTask({
          title,
          description,
          status,
          due_date: dueDate || undefined,
        });
      }
      resetForm();
      setShowForm(false);
      fetchTasks();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error saving task");
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setDueDate(task.due_date || "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await taskAPI.deleteTask(id);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {user?.name || "User"}
          </h1>
          <p className="text-gray-500">Here's what's on your plate today.</p>
        </div>

        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">My Tasks</h2>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h3 className="text-lg font-medium mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
              <select
                title="status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "pending" | "in_progress" | "completed"
                  )
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="date"
                title="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex gap-2">
                <Button type="submit">
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet. Add one above!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusColors[task.status]
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">
                      {task.description}
                    </p>
                  )}
                  {task.due_date && (
                    <p className="text-gray-500 text-xs">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(task)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the task "{task.title}".
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
