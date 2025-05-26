"use client";

import {
  useGetTaskPresenceQuery,
  useUpdateTaskPresenceMutation,
} from "@/redux/api/taskApi";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

interface TaskPresenceProps {
  taskId: string;
  userId: string;
}

export default function TaskPresence({ taskId, userId }: TaskPresenceProps) {
  const { data: presence, refetch } = useGetTaskPresenceQuery(taskId);
  const [updatePresence] = useUpdateTaskPresenceMutation();

  useEffect(() => {
    // Update presence every 30 seconds
    const interval = setInterval(() => {
      updatePresence({ taskId, userId });
    }, 30000);

    // Initial presence update
    updatePresence({ taskId, userId });

    return () => clearInterval(interval);
  }, [taskId, userId, updatePresence]);

  if (!presence?.length) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        {presence.map((user) => (
          <div
            key={user.userId}
            className="relative"
            title={`Last seen: ${new Date(user.lastSeen).toLocaleString()}`}
          >
            <UserCircleIcon
              className={`h-8 w-8 ${
                user.userId === userId ? "text-primary-600" : "text-gray-400"
              }`}
            />
            <span
              className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
                new Date().getTime() - new Date(user.lastSeen).getTime() < 60000
                  ? "bg-green-400"
                  : "bg-gray-400"
              }`}
            />
          </div>
        ))}
      </div>
      <span className="text-sm text-gray-500">
        {presence.length} {presence.length === 1 ? "person" : "people"} viewing
      </span>
    </div>
  );
}
