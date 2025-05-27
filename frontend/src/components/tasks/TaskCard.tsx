"use client";

import { Task } from "@/types/task";
import { CalendarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

  const priorityColors = {
    LOW: "bg-blue-100 text-blue-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-red-100 text-red-800",
  };

  const statusColors = {
    TODO: "bg-gray-100 text-gray-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    DONE: "bg-green-100 text-green-800",
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
        {task.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
            {task.assignee.name}
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
}
