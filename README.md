# ChatCraft

ChatCraft is a full-stack real-time collaborative coding platform inspired by modern cloud-based IDEs.  
It enables multiple users to collaborate on projects, edit code in real time, manage files, and stay synchronized using WebSockets.

---

## Problem Statement

Modern development teams rely heavily on real-time collaboration tools, yet building such systems requires deep understanding of state synchronization, event-driven architecture, and scalable backend communication.

ChatCraft was built to demonstrate practical implementation of these concepts using the MERN stack and real-time technologies.

---

## Core Features

- Real-time collaborative code editing
- Multi-user project rooms
- Live synchronization using WebSockets
- File and folder management system
- User authentication and authorization
- Persistent data storage
- Responsive and interactive UI

---

## Complete Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Context API (state management)
- Axios (API communication)

### Backend
- Node.js
- Express.js
- RESTful APIs
- JWT-based authentication

### Real-Time Communication
- Socket.io
- WebSockets

### Database
- MongoDB
- Mongoose (ODM)

### Authentication & Security
- JSON Web Tokens (JWT)
- Password hashing (bcrypt)
- Protected API routes

### Development & Tooling
- Git & GitHub
- Postman (API testing)
- npm (package management)

---

## Application Architecture

- React frontend communicates with Express backend using REST APIs
- Real-time events handled through Socket.io
- MongoDB stores users, projects, and file metadata
- JWT ensures secure user sessions
- WebSocket events synchronize code changes across connected users

---

## Screenshots

### Landing page View
![Collaboration](images/landingPage.png)

### Dashboard
![Dashboard](images/dashboard.png)

### Code Editor
![Code Editor](images/editor.png)

---

## Live Demo

(Add deployed application link here)

---

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB
- Git

### Steps

```bash
git clone https://github.com/Kunal-Gupta28/ChatCraft.git
cd ChatCraft

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Run backend
cd ../server
npm start

# Run frontend
cd ../client
npm start
