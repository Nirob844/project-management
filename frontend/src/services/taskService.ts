import { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  async createTask(task: CreateTaskInput): Promise<Task> {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  },

  async updateTask(id: string, task: UpdateTaskInput): Promise<Task> {
    const response = await axios.patch(`${API_URL}/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${API_URL}/tasks/${id}`);
  },

  async getMyTasks(): Promise<Task[]> {
    const response = await axios.get(`${API_URL}/tasks/my-tasks`);
    return response.data;
  },

  async getProjectTasks(projectId: string): Promise<Task[]> {
    const response = await axios.get(`${API_URL}/tasks/project/${projectId}`);
    return response.data;
  },
};

export default taskService;
