"use client";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/api/taskApi";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TaskFormProps {
  task?: Task;
  projectId: string;
  onSuccess?: () => void;
}

export default function TaskForm({
  task,
  projectId,
  onSuccess,
}: TaskFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH",
      dueDate: formData.get("dueDate") as string,
      projectId,
    };

    try {
      if (task) {
        await updateTask({ id: task.id, task: taskData as UpdateTaskInput });
      } else {
        await createTask(taskData as CreateTaskInput);
      }
      onSuccess?.();
      router.push("/dashboard/tasks");
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
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
            type="text"
            name="title"
            id="title"
            required
            defaultValue={task?.title}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
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
            name="description"
            id="description"
            rows={3}
            defaultValue={task?.description}
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
            name="priority"
            id="priority"
            required
            defaultValue={task?.priority || "MEDIUM"}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
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
            type="date"
            name="dueDate"
            id="dueDate"
            required
            defaultValue={task?.dueDate?.split("T")[0]}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
        >
          {isLoading
            ? task
              ? "Updating..."
              : "Creating..."
            : task
            ? "Update Task"
            : "Create Task"}
        </button>
      </div>
    </form>
  );
}
