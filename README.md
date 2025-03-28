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

Websocket


## Project setup

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

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run All Tests

npm run test
## Run Individual Service Tests
Run tests for specific microservices in watch mode for continuous testing:

### Auth Service
npm run test:watch auth

### Document Service
npm run test:watch documents

### Ingestion Service
npm run test:watch ingestion

### API Gateway
npm run test:watch api-gateway


# Test coverage
npm run test:cov

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



## 🛠 API Endpoints

🔹 Authentication

📌 Register a New User

🚀 POST /users/register

✅ Request:

{
  "username": "yourname",
  "email": "example@example.com",
  "password": "123456"
}

✅ Response:

"user created successfully"

📌 Login & Get JWT Token

🚀 POST /users/login

✅ Request:

{
  "email": "bhaskar@example.com",
  "password": "123456"
}

✅ Response:

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

📌 Get User Profile (Requires Authentication)

🚀 GET /users/profile

✅ Request (Authorization Header Required):

{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

✅ Response:

{
  "id": 1,
  "username": "bhaskar",
  "email": "bhaskar@example.com"
}


🔹 Documents

📌 Upload a Document (Requires Authentication)

🚀 POST /documents/upload

✅ Request (Authorization Header Required):

(Attach the file in the request)

✅ Response:

{
  "success": true,
  "documentId": 6
}

🔹 Ingestion

📌 Start Document Ingestion (Requires Authentication)

🚀 POST /ingestion/start

✅ Request (Authorization Header Required):

{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

✅ Body:

{
  "documentId": 1
}

✅ Response:

{
  "message": "Ingestion started",
  "documentId": 1,
  "status": "Processing"
}

📌 Track Ingestion Status in Real-Time (Requires Authentication)

🚀 GET /ingestion/status/:documentId

✅ Request (Authorization Header Required):

{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

✅ Response:

{
  "documentId": 1,
  "status": "Completed"
}


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
