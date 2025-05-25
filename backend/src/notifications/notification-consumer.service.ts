import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Channel, connect } from 'amqplib';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  @WebSocketServer()
  server: Server;

  private connection: any;
  private channel: Channel;
  private readonly exchange = 'task_events';
  private readonly queues = {
    statusChanges: 'task_status_changes',
    comments: 'task_comments',
    deadlines: 'task_deadlines',
  };

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.connection = await connect({
        hostname: this.configService.get('RABBITMQ_HOST'),
        port: this.configService.get('RABBITMQ_PORT'),
        username: this.configService.get('RABBITMQ_USER'),
        password: this.configService.get('RABBITMQ_PASSWORD'),
      });

      this.channel = await this.connection.createChannel();
      await this.setupConsumers();
    } catch (error) {
      console.error('Failed to initialize RabbitMQ connection:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }

  private async setupConsumers() {
    // Consume status change notifications
    await this.channel.consume(this.queues.statusChanges, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        this.server.to(`task:${data.taskId}`).emit('taskStatusChanged', data);
        this.channel.ack(msg);
      }
    });

    // Consume comment notifications
    await this.channel.consume(this.queues.comments, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        this.server.to(`task:${data.taskId}`).emit('newComment', data);
        this.channel.ack(msg);
      }
    });

    // Consume deadline notifications
    await this.channel.consume(this.queues.deadlines, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        this.server.to(`task:${data.taskId}`).emit('taskDueSoon', data);
        this.channel.ack(msg);
      }
    });
  }

  // WebSocket event handlers
  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleJoinTask(client: any, taskId: string) {
    client.join(`task:${taskId}`);
  }

  handleLeaveTask(client: any, taskId: string) {
    client.leave(`task:${taskId}`);
  }
}
