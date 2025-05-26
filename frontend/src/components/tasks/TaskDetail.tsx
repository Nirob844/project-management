"use client";

import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
} from "@/redux/api/taskApi";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskPresence from "./TaskPresence";

interface TaskDetailProps {
  taskId: string;
  userId: string;
  projectId: string;
}

export default function TaskDetail({
  taskId,
  userId,
  projectId,
}: TaskDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { data: task, isLoading, error } = useGetTaskByIdQuery(taskId);
  const [deleteTask] = useDeleteTaskMutation();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        router.push("/dashboard/tasks");
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading task</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
        <div className="flex items-center space-x-4">
          <TaskPresence taskId={taskId} userId={userId} />
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <TaskForm
          task={task}
          projectId={projectId}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-2 text-sm text-gray-900">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <p className="mt-2 text-sm text-gray-900">{task.priority}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              <p className="mt-2 text-sm text-gray-900">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
