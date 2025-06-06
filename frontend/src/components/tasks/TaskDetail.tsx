"use client";

import { useGetTaskByIdQuery } from "@/redux/api/taskApi";
import { getUserInfo } from "@/utils/auth";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";
import TaskPresence from "./TaskPresence";
import UpdateTaskModal from "./UpdateTaskModal";

interface TaskDetailProps {
  taskId: string;
}
interface UserInfo {
  role: string;
}

export default function TaskDetail({ taskId }: TaskDetailProps) {
  const { role } = getUserInfo() as UserInfo;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: task, isLoading, error } = useGetTaskByIdQuery(taskId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading task details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading task details</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Task not found</div>
      </div>
    );
  }

  const priorityColors = {
    LOW: "bg-blue-50 text-blue-700 ring-blue-600/20",
    MEDIUM: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    HIGH: "bg-red-50 text-red-700 ring-red-600/20",
  };

  const statusColors = {
    TODO: "bg-gray-50 text-gray-700 ring-gray-600/20",
    IN_PROGRESS: "bg-blue-50 text-blue-700 ring-blue-600/20",
    REVIEW: "bg-purple-50 text-purple-700 ring-purple-600/20",
    DONE: "bg-green-50 text-green-700 ring-green-600/20",
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {task.title}
            </h1>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                  priorityColors[task.priority as keyof typeof priorityColors]
                }`}
              >
                {task.priority}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                  statusColors[task.status as keyof typeof statusColors]
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <TaskPresence taskId={taskId} userId={task.assignee.id} />
            {role === "ADMIN" && (
              <>
                <button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4 mr-1.5" />
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Project</h3>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">
                  {task.project.name}
                </p>
                <p className="text-sm text-gray-500">
                  {task.project.description}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${
                    task.project.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : task.project.status === "DONE"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.project.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              <p className="mt-2 text-sm text-gray-900">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
              <div className="mt-2 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {task.assignee.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {task.assignee.name}
                  </p>
                  <p className="text-sm text-gray-500">{task.assignee.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <div className="mt-2 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {task.creator.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {task.creator.name}
                  </p>
                  <p className="text-sm text-gray-500">{task.creator.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-2 text-sm text-gray-900">
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Last Updated
              </h3>
              <p className="mt-2 text-sm text-gray-900">
                {new Date(task.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {role === "ADMIN" && (
        <>
          <UpdateTaskModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            task={task}
          />

          <DeleteTaskModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            taskId={task.id}
            taskTitle={task.title}
          />
        </>
      )}
    </div>
  );
}
