"use client";

import { useGetTaskByIdQuery } from "@/redux/api/taskApi";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";
import TaskPresence from "./TaskPresence";
import UpdateTaskModal from "./UpdateTaskModal";

interface TaskDetailProps {
  taskId: string;
}

export default function TaskDetail({ taskId }: TaskDetailProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: task, isLoading, error } = useGetTaskByIdQuery(taskId);

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
          <TaskPresence taskId={taskId} userId={task.assignee.id} />
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

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

      <UpdateTaskModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        task={task}
      />

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        taskId={taskId}
      />
    </div>
  );
}
