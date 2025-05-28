"use client";

import { Project } from "@/types/project";
import { getUserInfo } from "@/utils/auth";
import { formatDate } from "@/utils/date";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
}
interface UserInfo {
  role: string;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const { role } = getUserInfo() as UserInfo;
  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
          <Link href={`/dashboard/projects/${project.id}`}>{project.name}</Link>
        </h3>
        {role == "ADMIN" && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <PencilIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={onDelete}
              className="rounded-md p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
        {project.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              project.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : project.status === "DONE"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Created {formatDate(project.createdAt)}
        </p>
      </div>
    </div>
  );
}
