<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center"> A scalable and modular microservices architecture built with <a href="http://nodejs.org" target="_blank">Node.js</a> and <a href="https://nestjs.com/" target="_blank">NestJS</a>. </p> <p align="center"> <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a> <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a> <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a> </p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🔹 Overview
This NestJS-based microservices application includes:

User Management & Authentication (JWT-based authentication with RBAC)

Document Management (File uploads & access control)

Event-Driven Communication (RabbitMQ for messaging)

Database (PostgreSQL with TypeORM)

Ingestion System (Real-time processing & tracking)

Docker Deployment (Containerized services for scalability)


## 🔹 Microservices Structure
Service Name	Description
api-gateway	Handles authentication, routing, and user-facing API endpoints
user-service	Manages user registration, authentication, and profiles
document-service	Handles document uploads, permissions, and storage
ingestion-service	Processes document ingestion asynchronously


## 🚀 Getting Started
🔧 Prerequisites
Ensure you have the following installed:

Node.js (v18+)

Docker & Docker Compose

PostgreSQL

RabbitMQ


## 📌 Installation
Clone the repository and install dependencies:

git clone https://github.com/bhaskar4u/user-document.git
cd user-document
npm install


## ⚙️ Running the Application
🔹 Start Services Locally

### Start API Gateway
npm run start:dev  api-gateway

### Start Auth Service
npm run start:dev auth

### Start Document Service
npm run start:dev documents

### Start Ingestion Service
npm run start:dev ingestion


## 🔹 Run with Docker Compose
docker compose up -d

## 🧪 Running Tests
# Unit tests
npm run test

# Test coverage
npm run test:cov


## 🛠 API Endpoints
🔹 Authentication
POST /users/register – Register a new user

POST /users/login – Authenticate and receive a JWT token

GET /users/profile – Get the authenticated user's profile

🔹 Documents
POST /documents/upload – Upload a document (Authenticated users)

GET /documents/:id – Retrieve document details (Role-based access control)

🔹 Ingestion
POST /ingestion/start – Start document ingestion

GET /ingestion/status/:documentId – Track ingestion status in real-time

## 🛠 Tech Stack
Technology	Purpose
NestJS	Backend framework
PostgreSQL	Database
TypeORM	Database ORM
RabbitMQ	Event-driven communication
Docker	Containerization


## 📚 Resources
NestJS Docs: https://docs.nestjs.com

RabbitMQ: https://www.rabbitmq.com

PostgreSQL: https://www.postgresql.org/docs/


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## 👨‍💻 Contributors
👤 [Bhaskar Kumar]
📧 Email: [bhaskarsahni80@gmail.com]
🔗 GitHub: https://github.com/bhaskar4u

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
