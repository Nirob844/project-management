# Collaborative Project Management Tool

A modern, real-time project management application built with NestJS and Next.js.

## Features

- Task Management (Create, Assign, Update, Delete)
- Real-time Updates
- Role-based Access Control
- Task Dependencies & Project Timelines
- Real-time Notifications
- Advanced Search & Analytics
- Performance Optimized

## Tech Stack

### Backend

- NestJS
- TypeScript
- PostgreSQL
- Redis
- RabbitMQ
- GraphQL
- Elasticsearch

### Frontend

- Next.js
- TypeScript
- Redux Toolkit
- Material-UI
- React Query

### Infrastructure

- Docker
- Docker Compose
- CI/CD Pipeline

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd task-management
```

2. Start the development environment:

```bash
docker-compose up -d
```

3. Access the applications:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql

## Development

### Backend Development

```bash
cd backend
npm install
npm run start:dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## License

MIT

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
