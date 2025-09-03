<<<<<<< HEAD
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
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error saving task");
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
                onChange={(e) => setStatus(e.target.value as any)}
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
=======
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User, Truck, Package, BarChart, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [, setLocation] = useLocation();

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Tracking shipment: ${trackingNumber}`);
  };

  const isAdmin = user?.user_type === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img
                src="/logo.jpg"
                alt="Nonoy Lavina Trucking"
                className="h-10 w-10 rounded-lg mr-3"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e786c] to-[#cfab3d] bg-clip-text text-transparent">
                Nonoy Lavina Trucking
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button 
                onClick={logout}
                variant="destructive"
                className="flex items-center gap-2 hover:rotate-3 hover:shadow-red-500/50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your shipments and track deliveries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-[#1e786c]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Shipments</p>
                <p className="text-2xl font-semibold text-gray-900">248</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Truck className="h-8 w-8 text-[#cfab3d]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">236</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profile</p>
                <p className="text-lg font-semibold text-gray-900">Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Controls (only for admin users) */}
          {isAdmin && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Controls
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setLocation("/user-management")}
                  variant="info"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Manage Users
                </Button>
                <Button 
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg border-0"
                >
                  <Truck className="h-5 w-5" />
                  Manage Vehicles
                </Button>
                <Button 
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg border-0"
                >
                  <BarChart className="h-5 w-5" />
                  View Reports
                </Button>
              </div>
            </div>
          )}

          {/* Tracking Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Track Shipment
            </h3>
            <form onSubmit={handleTrackingSubmit} className="space-y-4">
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e786c] focus:border-transparent"
                  placeholder="Enter tracking number"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#1e786c] hover:bg-[#cfab3d] text-white"
              >
                Track Shipment
              </Button>
            </form>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <Package className="h-5 w-5 text-[#1e786c] mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Shipment #TRK001 delivered</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <Truck className="h-5 w-5 text-[#cfab3d] mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Shipment #TRK002 in transit</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <Package className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">New booking received</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
    </div>
  );
}
