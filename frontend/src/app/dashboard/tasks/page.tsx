"use client";

import TaskBoard from "@/components/tasks/TaskBoard";

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
      <div className="mt-6">
        <TaskBoard />
      </div>
    </div>
  );
}
