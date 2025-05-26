"use client";

import { Task } from "@/types/task";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks?: Task[];
}

type BoardStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

const mapTaskStatus = (status: Task["status"]): BoardStatus => {
  switch (status) {
    case "COMPLETED":
      return "DONE";
    case "ON_HOLD":
    case "CANCELLED":
      return "TODO";
    default:
      return status as BoardStatus;
  }
};

export default function TaskList({ tasks = [] }: TaskListProps) {
  const router = useRouter();

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const task = tasks.find((t) => t.id === draggableId);

    if (!task) return;

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: destination.droppableId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Refresh the page to get updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const status = mapTaskStatus(task.status);
      acc[status].push(task);
      return acc;
    },
    {
      TODO: [] as Task[],
      IN_PROGRESS: [] as Task[],
      REVIEW: [] as Task[],
      DONE: [] as Task[],
    }
  );

  const columns = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "REVIEW", title: "Review" },
    { id: "DONE", title: "Done" },
  ];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4 h-full">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <h3 className="font-semibold mb-2">{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 bg-gray-50 rounded-lg p-2 min-h-[200px]"
                >
                  {groupedTasks[column.id as BoardStatus].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onClick={() => router.push(`/tasks/${task.id}`)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
