"use client";

import ProjectDetail from "@/components/projects/ProjectDetail";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const { id } = useParams();
  return <ProjectDetail projectId={id as string} />;
}
