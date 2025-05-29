"use client";

import { useDeleteTaskMutation } from "@/redux/api/taskApi";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

export default function DeleteTaskModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
}: DeleteTaskModalProps) {
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task">
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete "{taskTitle}"? This action cannot be
          undone.
        </p>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
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
    </Modal>
  );
}
