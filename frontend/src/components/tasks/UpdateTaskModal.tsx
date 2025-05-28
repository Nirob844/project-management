"use client";

import { useUpdateTaskMutation } from "@/redux/api/taskApi";
import { Task } from "@/types/task";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

type FormData = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  dueDate: string;
};

// Helper function to format date for input[type="date"]
const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export default function UpdateTaskModal({
  isOpen,
  onClose,
  task,
}: UpdateTaskModalProps) {
  const [updateTask, { isLoading, isError, error }] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: formatDate(task.dueDate),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Convert the date to ISO-8601 format
      const formattedData = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      await updateTask({ id: task.id, ...formattedData }).unwrap();
      onClose();
    } catch (err) {
      // Error is handled by RTK Query
      console.error("Failed to update task:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              {error
                ? (error as any).message || "Failed to update task"
                : "Failed to update task"}
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <div className="mt-2">
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              id="title"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              {...register("description")}
              id="description"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Priority
          </label>
          <div className="mt-2">
            <select
              {...register("priority", { required: "Priority is required" })}
              id="priority"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
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
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Status
          </label>
          <div className="mt-2">
            <select
              {...register("status", { required: "Status is required" })}
              id="status"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
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

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Due Date
          </label>
          <div className="mt-2">
            <input
              {...register("dueDate")}
              type="date"
              id="dueDate"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
