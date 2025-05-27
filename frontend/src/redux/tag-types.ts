export const tagTypes = {
  task: "Task",
  project: "Project",
  user: "User",
  comment: "Comment",
  notification: "Notification",
} as const;

export const tagTypesList = Object.values(tagTypes);
