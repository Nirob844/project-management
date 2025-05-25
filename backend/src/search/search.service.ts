import { Client } from '@elastic/elasticsearch';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Project, Task } from '@prisma/client';

interface SearchDocument {
  id: string;
  type: 'task' | 'project';
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  assigneeId?: string;
  creatorId?: string;
  ownerId?: string;
  dueDate?: Date;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly client: Client;
  private readonly index = 'project_management';

  constructor(private configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('ELASTICSEARCH_URL')!,
      auth: {
        username: this.configService.get('ELASTICSEARCH_USERNAME')!,
        password: this.configService.get('ELASTICSEARCH_PASSWORD')!,
      },
    });
  }

  async onModuleInit() {
    await this.createIndexIfNotExists();
  }

  private async createIndexIfNotExists() {
    const exists = await this.client.indices.exists({ index: this.index });
    if (!exists) {
      await this.client.indices.create({
        index: this.index,
        mappings: {
          properties: {
            id: { type: 'keyword' },
            type: { type: 'keyword' },
            title: { type: 'text', analyzer: 'english' },
            description: { type: 'text', analyzer: 'english' },
            status: { type: 'keyword' },
            priority: { type: 'keyword' },
            projectId: { type: 'keyword' },
            assigneeId: { type: 'keyword' },
            creatorId: { type: 'keyword' },
            dueDate: { type: 'date' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
          },
        },
      });
    }
  }

  async indexTask(task: Task) {
    const doc: SearchDocument = {
      id: task.id,
      type: 'task',
      title: task.title,
      description: task.description || undefined,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      assigneeId: task.assigneeId || undefined,
      creatorId: task.creatorId,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    await this.client.index({
      index: this.index,
      id: `task_${task.id}`,
      document: doc,
    });
  }

  async indexProject(project: Project) {
    const doc: SearchDocument = {
      id: project.id,
      type: 'project',
      title: project.name,
      description: project.description || undefined,
      status: project.status,
      ownerId: project.ownerId,
      startDate: project.startDate || undefined,
      endDate: project.endDate || undefined,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    await this.client.index({
      index: this.index,
      id: `project_${project.id}`,
      document: doc,
    });
  }

  async search(query: string, filters: Record<string, any> = {}) {
    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['title^3', 'description'],
          fuzziness: 'AUTO',
        },
      },
    ];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        must.push({ term: { [key]: value } });
      }
    });

    const response = await this.client.search<SearchDocument>({
      index: this.index,
      query: {
        bool: { must },
      },
      sort: [{ _score: { order: 'desc' } }, { createdAt: { order: 'desc' } }],
    });

    return response.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));
  }

  async deleteDocument(id: string) {
    await this.client.delete({
      index: this.index,
      id,
    });
  }

  async updateDocument(id: string, doc: Partial<SearchDocument>) {
    await this.client.update({
      index: this.index,
      id,
      doc,
    });
  }
}
