"use client";

import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import UpdateProjectModal from "@/components/projects/UpdateProjectModal";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import { useGetProjectByIdQuery } from "@/redux/api/projectApi";
import { useGetTaskByProjectIdQuery } from "@/redux/api/taskApi";
import { Task } from "@/types/task";
import { getUserInfo } from "@/utils/auth";
import { formatDate } from "@/utils/date";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectDetailProps {
  projectId: string;
}

interface UserInfo {
  role: string;
}

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const router = useRouter();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const { role } = getUserInfo() as UserInfo;

  const { data: project, isLoading: isProjectLoading } =
    useGetProjectByIdQuery(projectId);
  const { data: tasks, isLoading: isTasksLoading } =
    useGetTaskByProjectIdQuery(projectId);

  if (isProjectLoading || isTasksLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(project.createdAt)} by {project?.owner?.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              project.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : project.status === "DONE"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {project?.status?.charAt(0)?.toUpperCase() +
              project?.status?.slice(1)}
          </span>
          {role === "ADMIN" && (
            <>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Edit Project
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
              >
                <TrashIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Delete Project
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Description</h2>
        <p className="mt-2 text-sm text-gray-600">{project.description}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
          <button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Task
          </button>
        </div>

        {tasks?.length === 0 ? (
          <div className="mt-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {tasks?.map((task: Task) => (
              <Link
                key={task.id}
                href={`/dashboard/tasks/${task.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {task.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-800"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status
                      .split("_")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {task.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
        <div className="mt-4 space-y-4">
          {project.members.map((member: any) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {role === "ADMIN" && (
        <>
          <UpdateProjectModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            project={project}
          />

          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              router.push("/dashboard/projects");
            }}
            projectId={project.id}
            projectName={project.name}
          />

          <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            onClose={() => setIsCreateTaskModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
