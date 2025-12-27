# ChatCraft

ChatCraft is a full-stack real-time collaborative coding platform inspired by modern cloud IDEs.  
It allows multiple users to collaborate on code simultaneously, manage files, and communicate in real time using WebSockets.

## Problem Statement

Most beginner developers lack exposure to real-time collaborative systems used in professional environments.  
ChatCraft aims to simulate such systems by providing a browser-based collaborative coding experience.

## Features

- Real-time collaborative code editing
- Multi-user room support
- Live synchronization using WebSockets
- File and project management
- User authentication
- Responsive user interface


## Tech Stack

### Frontend
- React
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- Socket.io

### Database
- MongoDB


## Architecture Overview

- Client connects to server using Socket.io
- Server handles real-time events and broadcasts changes
- MongoDB stores user and project data
- Authentication ensures secure access


## Screenshots

(Add screenshots of UI, editor, collaboration view here)


## Live Demo

(Add deployed link here)


## Installation & Setup

### Prerequisites
- Node.js
- MongoDB
- Git

### Steps
```bash
git clone https://github.com/Kunal-Gupta28/ChatCraft.git
cd ChatCraft
npm install
npm start
