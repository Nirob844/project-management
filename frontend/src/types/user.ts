export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  PROJECT_MANAGER = "PROJECT_MANAGER",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  projectIds?: string[];
  taskIds?: string[];
}
