import { Task } from "@/types/task";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "HIGH":
      return "text-red-600";
    case "MEDIUM":
      return "text-yellow-600";
    case "LOW":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "DONE":
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    case "IN_PROGRESS":
      return <ClockIcon className="w-5 h-5 text-blue-600" />;
    case "REVIEW":
      return <ExclamationCircleIcon className="w-5 h-5 text-yellow-600" />;
    default:
      return <ClockIcon className="w-5 h-5 text-gray-600" />;
  }
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow p-4 mb-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        {getStatusIcon(task.status)}
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">
            {task.assignee?.name || "Unassigned"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={getPriorityColor(task.priority)}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-gray-500">
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
