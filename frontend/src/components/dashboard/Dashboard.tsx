"use client";

import { useGetProjectsQuery } from "@/redux/api/projectApi";
import { useGetMyTaskQuery, useGetTasksQuery } from "@/redux/api/taskApi";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { getUserInfo } from "@/utils/auth";
import {
  ChartBarIcon,
  ClockIcon,
  FolderIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface UserInfo {
  role: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">
              {title}
            </dt>
            <dd className="text-lg font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { role } = getUserInfo() as UserInfo;
  const { data: projects } = useGetProjectsQuery({});
  const { data: tasks, isLoading: tasksLoading } =
    mounted && role === "ADMIN" ? useGetTasksQuery({}) : useGetMyTaskQuery({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
      icon: FolderIcon,
      color: "bg-blue-500",
    },
    {
      title: "Total Tasks",
      value: tasks?.length || 0,
      icon: ChartBarIcon,
      color: "bg-green-500",
    },
    {
      title: "In Progress Tasks",
      value:
        tasks?.filter((task: Task) => task.status === "IN_PROGRESS").length ||
        0,
      icon: ClockIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Team Members",
      value:
        projects?.reduce(
          (acc: number, project: Project) =>
            acc + (project.members?.length || 0),
          0
        ) || 0,
      icon: UserGroupIcon,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Recent Projects
            </h3>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {projects?.slice(0, 5).map((project: Project) => (
                  <li key={project.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FolderIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {project.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {project.description}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Recent Tasks
            </h3>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {tasks?.slice(0, 5).map((task: Task) => (
                  <li key={task.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <ChartBarIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {task.description}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
