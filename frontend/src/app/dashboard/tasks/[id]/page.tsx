"use client";

import TaskDetail from "@/components/tasks/TaskDetail";
import { getUserInfo } from "@/utils/auth";
import { useParams } from "next/navigation";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { sub: userId } = getUserInfo() as { sub: string };
  const { projectId } = useParams();

  return (
    <div className="p-6">
      <div className="mt-6">
        <TaskDetail
          taskId={params.id}
          userId={userId}
          projectId={projectId as string}
        />
      </div>
    </div>
  );
}
