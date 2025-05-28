"use client";

import TaskDetail from "@/components/tasks/TaskDetail";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  return (
    <div className="p-6">
      <div className="mt-6">
        <TaskDetail taskId={params.id} />
      </div>
    </div>
  );
}
