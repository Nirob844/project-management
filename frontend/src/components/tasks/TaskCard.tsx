"use client";

import { useUpdateTaskMutation } from "@/redux/api/taskApi";
import { Status, Task } from "@/types/task";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: Task;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "LOW":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case "TODO":
      return "bg-gray-100 text-gray-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "REVIEW":
      return "bg-purple-100 text-purple-800";
    case "DONE":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  const [updateTask] = useUpdateTaskMutation();

  const handleStatusChange = async (newStatus: Status) => {
    try {
      await updateTask({
        id: task.id,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/tasks/${task.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-5 border border-gray-100 hover:border-gray-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 pr-2">
          {task.title}
        </h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-4">
          {/* <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div> */}
          <div className="flex items-center text-sm text-gray-500">
            <UserCircleIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            {task.assignee.name}
          </div>
        </div>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as Status)}
          onClick={(e) => e.stopPropagation()}
          className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer border-0 focus:ring-0 transition-colors duration-200 ${getStatusColor(
            task.status
          )}`}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="REVIEW">Review</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
}
