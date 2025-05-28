"use client";

import { useDeleteUserMutation } from "@/redux/api/userApi";
import { User } from "@/types/user";
import Modal from "../common/Modal";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  user,
}: DeleteUserModalProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(user.id).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User">
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete {user.name}? This action cannot be
          undone.
        </p>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleDelete}
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
