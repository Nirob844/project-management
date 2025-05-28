"use client";

import { useDeleteProjectMutation } from "@/redux/api/projectApi";
import { Project } from "@/types/project";
import Modal from "../ui/Modal";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function DeleteProjectModal({
  isOpen,
  onClose,
  project,
}: DeleteProjectModalProps) {
  const [deleteProject, { isLoading, error }] = useDeleteProjectMutation();

  const handleDelete = async () => {
    try {
      await deleteProject(project.id).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this project? This action cannot be
          undone.
        </p>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error deleting project
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error instanceof Error
                    ? error.message
                    : "Failed to delete project"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
