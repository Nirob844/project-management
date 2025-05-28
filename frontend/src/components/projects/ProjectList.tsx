"use client";

import CreateProjectModal from "@/components/projects/CreateProjectModal";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import ProjectCard from "@/components/projects/ProjectCard";
import UpdateProjectModal from "@/components/projects/UpdateProjectModal";
import { useGetProjectsQuery } from "@/redux/api/projectApi";
import { Project } from "@/types/project";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: projects, isLoading, error } = useGetProjectsQuery({});

  const filteredProjects = projects?.filter((project: Project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">Failed to load projects</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Create Project
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {filteredProjects?.length === 0 ? (
        <div className="text-center py-12">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No projects
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects?.map((project: Project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project)}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedProject && (
        <>
          <UpdateProjectModal
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
          />

          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
          />
        </>
      )}
    </div>
  );
}
