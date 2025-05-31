# Collaborative Project Management Tool

A modern, real-time project management application built with NestJS and Next.js, designed for scalability and high performance.

## Features

### Project Management

- Create, update, and delete projects
- Project progress tracking
- Project timeline management
- Team member management
- Project status tracking (Active, Archived, Done)

### Task Management

- Create, assign, update, and delete tasks
- Task dependencies and subtasks
- Task priority levels (Low, Medium, High, Urgent)
- Task status tracking (Todo, In Progress, Review, Done)
- Due date management
- Task comments and discussions

### User Management

- Role-based access control (Admin, Project Manager, User)
- User profile management
- Team member assignments
- User activity tracking

### Real-time Features

- Real-time updates using Socket.IO
- Instant notifications for:
  - Task assignments
  - Status changes
  - Comments
  - Due date reminders
  - Project invitations
  - Role changes

### Dashboard & Analytics

- Project overview statistics
- Task progress tracking
- Team member activity
- Performance metrics
- Custom dashboard views

## Architecture Overview

### System Design

The application follows a monolithic architecture pattern with the following components:

1. **Backend Service (NestJS)**

   - RESTful API endpoints
   - Authentication and authorization
   - Business logic implementation
   - Database operations
   - Real-time WebSocket using Socket.IO
   - Caching with Redis
   - Message queuing with RabbitMQ

2. **Frontend Service (Next.js)**

   - User interface with Tailwind CSS
   - State management with Redux Toolkit
   - API integration with RTK Query
   - Real-time updates handling with Socket.IO client
   - Responsive design
   - Role-based UI components

3. **Database Layer**
   - PostgreSQL for primary data storage
   - Redis for caching and session management
   - Data models:
     - Users
     - Projects
     - Tasks
     - Comments
     - Notifications

### Data Flow

1. Client requests → Next.js Frontend
2. Frontend → RTK Query → NestJS Backend
3. Backend → Authentication/Authorization
4. Database operations
5. Real-time updates via Socket.IO
6. Response to client

## Tech Stack

### Backend

- NestJS (v10.x)
- TypeScript (v5.x)
- PostgreSQL (v15.x)
- Redis (v7.x)
- Socket.IO (v4.x)
- RabbitMQ (v3.x)

### Frontend

- Next.js (v14.x)
- TypeScript (v5.x)
- Redux Toolkit with RTK Query
- Tailwind CSS (v3.x)
- Socket.IO Client (v4.x)

### Infrastructure

- Docker
- Docker Compose
- CI/CD Pipeline (GitHub Actions)

## API Documentation

The API documentation is available through:

[Project Management API Collection](https://orange-comet-580888.postman.co/workspace/My-Workspace~84cdba3c-c201-4f13-83ff-afaa2823f879/collection/27398089-bf9f9a87-ec7a-433c-b9f4-172a5e6c9ee0?action=share&creator=27398089)

## Getting Started

### Prerequisites

- Docker (v24.x or later)
- Docker Compose (v2.x or later)
- Node.js (v18.x or later)
- Yarn (v1.22.x or later)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Nirob844/project-management
cd project-management
```

2. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development environment:

```bash
docker-compose up -d
```

4. Access the applications:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development

### Backend Development

```bash
cd backend
yarn install
yarn start:dev
```

### Frontend Development

```bash
cd frontend
yarn install
yarn dev
```

## License

MIT
