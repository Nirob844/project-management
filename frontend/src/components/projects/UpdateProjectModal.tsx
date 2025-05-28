"use client";

import { useUpdateProjectMutation } from "@/redux/api/projectApi";
import { Project } from "@/types/project";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";

interface UpdateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

interface FormData {
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
}

export default function UpdateProjectModal({
  isOpen,
  onClose,
  project,
}: UpdateProjectModalProps) {
  const [updateProject, { isLoading, error }] = useUpdateProjectMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateProject({ id: project.id, ...data }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Project">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description", {
              required: "Description is required",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status", { required: "Status is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error updating project
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error instanceof Error
                    ? error.message
                    : "Failed to update project"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2"
          >
            {isLoading ? "Updating..." : "Update Project"}
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
      </form>
    </Modal>
  );
}
