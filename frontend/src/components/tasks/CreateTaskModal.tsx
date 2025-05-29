"use client";

import { useGetProjectsQuery } from "@/redux/api/projectApi";
import { useCreateTaskMutation } from "@/redux/api/taskApi";
import { useGetUsersQuery } from "@/redux/api/userApi";
import { Project } from "@/types/project";
import { Priority, Status } from "@/types/task";
import { User } from "@/types/user";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  assigneeId: string;
  projectId: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const [createTask, { isLoading, error }] = useCreateTaskMutation();
  const { data: projects } = useGetProjectsQuery({});
  const { data: users } = useGetUsersQuery({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      status: "TODO",
      priority: "MEDIUM",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Convert the date to ISO-8601 format
      const formattedData = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      await createTask(formattedData).unwrap();
      toast.success("Task created successfully");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              {...register("priority", { required: "Priority is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">
                {errors.priority.message}
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
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="projectId"
              className="block text-sm font-medium text-gray-700"
            >
              Project
            </label>
            <select
              id="projectId"
              {...register("projectId", { required: "Project is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select a project</option>
              {projects?.map((project: Project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.projectId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium text-gray-700"
            >
              Assignee
            </label>
            <select
              id="assigneeId"
              {...register("assigneeId", { required: "Assignee is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select an assignee</option>
              {users?.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.assigneeId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.assigneeId.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            {...register("dueDate", { required: "Due date is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error creating task
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error instanceof Error
                    ? error.message
                    : "Failed to create task"}
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
            {isLoading ? "Creating..." : "Create Task"}
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
