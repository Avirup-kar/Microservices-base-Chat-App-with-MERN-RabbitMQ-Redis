# Microservices Chat Application with MERN, RabbitMQ & Redis

A modern, scalable microservices-based chat application built with the MERN stack (MongoDB, Express, React, Node.js), featuring real-time communication using WebSockets, message queuing with RabbitMQ, and caching with Redis.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Backend Services](#backend-services)
- [Frontend](#frontend)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Features](#features)

## 🎯 Project Overview

This is a production-ready microservices architecture for a real-time chat application where:

- **User Service**: Manages user authentication, registration, and profile management
- **Chat Service**: Handles chat operations, message management, and real-time WebSocket connections
- **Mail Service**: Asynchronous email processing using RabbitMQ message queue
- **Frontend**: Next.js-based responsive UI for seamless user experience

## 🛠 Tech Stack

### Backend
- **Node.js & Express**: Server runtime and REST API framework
- **TypeScript**: Type-safe backend development
- **MongoDB**: NoSQL database for data persistence
- **RabbitMQ**: Message broker for asynchronous task processing
- **Redis**: In-memory cache for performance optimization
- **Socket.io**: Real-time bidirectional communication
- **Cloudinary**: Image hosting and transformation

### Frontend
- **Next.js 14+**: React framework for production-grade web applications
- **TypeScript**: Type-safe frontend development
- **Socket.io Client**: Real-time communication with backend
- **Context API**: Global state management

### Infrastructure
- **Docker**: Containerization (recommended for RabbitMQ & Redis)
- **JWT**: Secure authentication tokens

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│              User Interface & Real-time Chat            │
└────────┬────────────────┬────────────────┬──────────────┘
         │ HTTP           │ HTTP           │ WebSocket
         ▼                ▼                ▼
    ┌─────────┐    ┌──────────┐   ┌──────────────┐
    │  User   │    │   Chat   │   │    Mail      │
    │ Service │    │ Service  │   │   Consumer   │
    │:3000    │    │  :3001   │   │              │
    └──┬──────┘    └────┬─────┘   └──────┬───────┘
       │                │                │
       │________________│___             │
       │ ┌──────────────┘   |            │
       │ │                  |            │
       ▼ ▼                  ▼            ▼
    ┌─────────┐       ┌────────┐   ┌──────────┐
    │ MongoDB │       │ Redis  │   │ RabbitMQ │
    │         │       │(Cache) │   │ (Message │
    │(Database)       │        │   │  Queue)  │
    └─────────┘       └────────┘   └──────────┘
```

**Note:** The frontend communicates directly with individual microservices. There is no centralized API Gateway - each service runs on its own port and the frontend makes direct HTTP/WebSocket requests to the appropriate service.

## 📁 Project Structure

```
.
├── backend/
│   ├── chat/                 # Chat Microservice
│   │   ├── src/
│   │   │   ├── index.ts                    # Service entry point & Socket setup
│   │   │   ├── config/
│   │   │   │   ├── cloudinary.ts           # Image upload configuration
│   │   │   │   ├── db.ts                   # MongoDB connection
│   │   │   │   ├── socket.ts               # Socket.io configuration
│   │   │   │   └── TryCatch.ts             # Error handling wrapper
│   │   │   ├── controllers/
│   │   │   │   └── chat.ts                 # Chat business logic
│   │   │   ├── middlewares/
│   │   │   │   ├── isAuth.ts               # JWT authentication
│   │   │   │   └── multer.ts               # File upload handling
│   │   │   ├── models/
│   │   │   │   ├── Chat.ts                 # Chat schema
│   │   │   │   └── Message.ts              # Message schema
│   │   │   └── routes/
│   │   │       └── chat.ts                 # Chat endpoints
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── user/                 # User Authentication Microservice
│   │   ├── src/
│   │   │   ├── index.ts                    # Service entry point
│   │   │   ├── config/
│   │   │   │   ├── db.ts                   # MongoDB connection
│   │   │   │   ├── generateToken.ts        # JWT token generation
│   │   │   │   ├── rabbitmq.ts             # RabbitMQ connection
│   │   │   │   └── TryCatch.ts             # Error handling wrapper
│   │   │   ├── controllers/
│   │   │   │   └── user.ts                 # Auth & user management logic
│   │   │   ├── middleware/
│   │   │   │   └── isAuth.ts               # JWT authentication
│   │   │   ├── model/
│   │   │   │   └── User.ts                 # User schema
│   │   │   └── routes/
│   │   │       └── user.ts                 # User endpoints
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mail/                 # Mail Service (Consumer)
│       ├── src/
│       │   ├── index.ts                    # Service entry point
│       │   └── consumer.ts                 # RabbitMQ message consumer
│       ├── package.json
│       └── tsconfig.json
│
├── frontend/                 # Next.js Frontend Application
│   ├── app/
│   │   ├── page.tsx                        # Home page
│   │   ├── layout.tsx                      # Root layout
│   │   ├── globals.css                     # Global styles
│   │   ├── login/
│   │   │   └── page.tsx                    # Login page
│   │   ├── verify/
│   │   │   └── page.tsx                    # OTP verification page
│   │   ├── profile/
│   │   │   └── page.tsx                    # User profile page
│   │   ├── chat/
│   │   │   └── page.tsx                    # Chat page
│   │   ├── components/
│   │   │   ├── ChatHeader.tsx              # Chat header component
│   │   │   ├── ChatMessages.tsx            # Messages display
│   │   │   ├── ChatSidebar.tsx             # Sidebar with conversations
│   │   │   ├── MessageInput.tsx            # Message input form
│   │   │   ├── Loading.tsx                 # Loading indicator
│   │   │   └── VerifyOtp.tsx               # OTP verification component
│   │   ├── context/
│   │   │   ├── AppContext.tsx              # Global app state
│   │   │   └── SocketContext.tsx           # Socket.io state management
│   │   └── public/                         # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   └── README.md
│
└── README.md                 # This file
```

## 🚀 Backend Services

### 1. **User Service** (`backend/user/`)

Handles user authentication, registration, verification, and profile management.

**Key Features:**
- User login with email
- OTP verification for users
- User profile management
- Retrieve all users
- Get specific user by ID
- Update user name
- JWT-based authentication
- Integration with RabbitMQ for email sending

**Environment Variables:**
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_key
RABBITMQ_URL=amqp://localhost
NODE_ENV=development
```

**Routes:**
```javascript
userRoutes.post("/login", loginUser);
userRoutes.post("/verify", verifyUser);
userRoutes.get("/me", isAuth, myProfile);
userRoutes.get("/user/all", isAuth, getAllUsers);
userRoutes.get("/user/:id", getAUser);
userRoutes.post("/update/userName", isAuth, updateName);
```

**All endpoints are prefixed with:** `/api/v1`

---

### 2. **Chat Service** (`backend/chat/`)

Manages chat operations, messages, and real-time communication via WebSockets.

**Key Features:**
- Create and manage chat conversations
- Send and retrieve messages
- Real-time message delivery using Socket.io
- File/image upload to Cloudinary
- User presence detection (online/offline status)
- Message read receipts
- Integration with Redis for caching

**Environment Variables:**
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_key
REDIS_URL=redis://localhost:6379
SOCKET_PORT=3002
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

**Routes:**
```javascript
chatRoutes.post("/chat/new", isAuth, createNewChat);
chatRoutes.get("/chat/all", isAuth, getAllChats);
chatRoutes.post("/message/send", isAuth, upload.single("image"), sendMessage);
chatRoutes.get("/message/:chatId", isAuth, getMessageByChat);
```

**All endpoints are prefixed with:** `/api/v1`

**Socket Events:**
- `connection` - User connects to chat (establishes socket connection with userId)
- `getOnlineUsers` - Emits list of all currently online users to all connected clients
- `typing` - User typing in a chat (emits `userId` and `chatId`)
- `userTyping` - Received by other users when someone is typing in the chat room
- `stopTyping` - User stopped typing in a chat (emits `userId` and `chatId`)
- `userStoppedTyping` - Received by other users when someone stops typing
- `joinChat` - User joins a specific chat room by `chatId`
- `leaveChat` - User leaves a specific chat room by `chatId`
- `newMessage` - New message event (emitted to chat room and receiver)
- `messagesSeen` - Emitted when messages are marked as seen (includes `chatId`, `seenBy`, `messageIds`)
- `disconnect` - User disconnects from socket
- `connect_error` - Connection error occurred

---

### 3. **Mail Service** (`backend/mail/`)

Asynchronous email processing consumer that listens to RabbitMQ message queue.

**Key Features:**
- RabbitMQ consumer for email jobs
- OTP email sending
- Welcome emails
- Email templates
- Retry logic for failed emails

**Environment Variables:**
```
RABBITMQ_URL=amqp://localhost
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
NODE_ENV=development
```

**Supported Queues:**
- `email-queue` - Email sending queue
- Triggered by User and Chat services

**Note:** Mail Service runs as a standalone consumer and does not expose direct HTTP endpoints. It processes messages asynchronously from RabbitMQ.

---

## 💻 Frontend

Built with Next.js 14+ and TypeScript for a modern, responsive chat UI.

**Key Features:**
- Server-side rendering (SSR) for better performance
- Real-time messaging with Socket.io
- Responsive design for mobile and desktop
- Context API for state management
- Image upload support

**Pages:**
- `/` - Home page
- `/login` - User login
- `/verify` - OTP verification
- `/profile` - User profile management
- `/chat` - Main chat interface

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **RabbitMQ** (local or cloud instance)
- **Redis** (optional, for caching)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Microservices_base_ChatApp_with_MERN-RabbitMQ-Redis
```

### 2. Install Dependencies

**User Service:**
```bash
cd backend/user
npm install
```

**Chat Service:**
```bash
cd backend/chat
npm install
```

**Mail Service:**
```bash
cd backend/mail
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create `.env` files in each service directory with the required variables listed above.

### 4. Start MongoDB, RabbitMQ & Redis

**Using Docker (Recommended):**
```bash
docker-compose up -d
```

Or manually start services on your machine.

---

## 🎮 Running the Application

### Development Mode

**Terminal 1 - User Service:**
```bash
cd backend/user
npm run dev
```

**Terminal 2 - Chat Service:**
```bash
cd backend/chat
npm run dev
```

**Terminal 3 - Mail Service:**
```bash
cd backend/mail
npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: `http://localhost:3000`
- User Service: `http://localhost:3000`
- Chat Service: `http://localhost:3001` (handles real-time WebSocket connections)

### Production Mode

```bash
cd backend/user && npm run build && npm start
cd backend/chat && npm run build && npm start
cd backend/mail && npm run build && npm start
cd frontend && npm run build && npm run dev
```

---

## 📡 API Endpoints

All API endpoints are prefixed with `/api/v1`

### User Service Endpoints

- `POST /api/v1/login` - Login user
- `POST /api/v1/verify` - Verify user (OTP verification)
- `GET /api/v1/me` - Get current user profile (requires authentication)
- `GET /api/v1/user/all` - Get all users (requires authentication)
- `GET /api/v1/user/:id` - Get specific user by ID
- `POST /api/v1/update/userName` - Update user name (requires authentication)

### Chat Service Endpoints

- `POST /api/v1/chat/new` - Create new chat (requires authentication)
- `GET /api/v1/chat/all` - Get all chats (requires authentication)
- `POST /api/v1/message/send` - Send message with optional image upload (requires authentication)
- `GET /api/v1/message/:chatId` - Get all messages in a chat (requires authentication)

### Mail Service

- Asynchronous email consumer - listens to RabbitMQ queue for email jobs
- No direct API endpoints; triggered by other services

---

## ✨ Features

✅ **Real-time Chat** - WebSocket-based instant messaging
✅ **User Authentication** - Secure JWT-based auth with OTP verification
✅ **File Uploads** - Image uploads via Cloudinary
✅ **Presence Detection** - Online/offline user status
✅ **Message Typing** - Real-time typing indicators
✅ **Conversation Management** - Create and manage multiple chats
✅ **Responsive UI** - Mobile-friendly design
✅ **Microservices Architecture** - Scalable, independent services
✅ **Message Queue** - Asynchronous email processing with RabbitMQ
✅ **Caching** - Performance optimization with Redis
✅ **TypeScript** - Type-safe JavaScript across frontend and backend

---

## 🚀 Future Enhancements

- [ ] Message search functionality
- [ ] Group chats and channels
- [ ] Call/Video conferencing
- [ ] Message reactions and emojis
- [ ] End-to-end encryption
- [ ] Advanced analytics dashboard
- [ ] Rate limiting and security enhancements
- [ ] Push notifications
- [ ] Database replication and backup

---


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Happy Coding! 🎉**
