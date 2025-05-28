"use client";

import { useUpdateTaskMutation } from "@/redux/api/taskApi";
import { Status, Task } from "@/types/task";
import { CalendarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: Task;
}

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
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
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
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as Status)}
          onClick={(e) => e.stopPropagation()}
          className="rounded-full px-2 py-1 text-xs font-medium cursor-pointer bg-gray-100 text-gray-800 border-0 focus:ring-0"
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
