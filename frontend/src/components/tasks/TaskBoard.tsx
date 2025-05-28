"use client";

import { useGetMyTaskQuery, useGetTasksQuery } from "@/redux/api/taskApi";
import { Task } from "@/types/task";
import { getUserInfo } from "@/utils/auth";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";

const columns = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review" },
  { id: "DONE", title: "Done" },
] as const;

interface UserInfo {
  role: string;
}

export default function TaskBoard() {
  const { role } = getUserInfo() as UserInfo;
  const {
    data: tasks,
    isLoading,
    error,
  } = role === "ADMIN" ? useGetTasksQuery({}) : useGetMyTaskQuery({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading tasks</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {role === "ADMIN" ? "Task Board" : "My Tasks"}
        </h2>
        {role === "ADMIN" && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {column.title}
              </h3>
              <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                {tasks?.filter((task: Task) => task.status === column.id)
                  .length || 0}
              </span>
            </div>
            <div className="rounded-xl p-4 bg-gray-50 min-h-[200px]">
              <div className="space-y-4">
                {tasks
                  ?.filter((task: Task) => task.status === column.id)
                  .map((task: Task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
