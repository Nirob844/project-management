"use client";

import TaskDetail from "@/components/tasks/TaskDetail";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  // In a real app, you would get the userId from your auth context
  const userId = "user-123";
  const projectId = "project-123";

  return (
    <div>
      <div className="mt-6">
        <TaskDetail taskId={params.id} userId={userId} projectId={projectId} />
      </div>
    </div>
  );
}
