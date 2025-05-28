export interface Project {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "ARCHIVED" | "DONE";
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: "owner" | "admin" | "member";
  }>;
}
