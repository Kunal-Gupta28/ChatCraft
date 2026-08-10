# 🚀 ChatCraft – Real-Time Collaborative AI Code Editor & Cloud IDE

ChatCraft is a full-stack, real-time collaborative coding platform and cloud IDE built with the MERN stack. It empowers developers and teams to create, edit, run, and collaborate on code in real time while leveraging an integrated **AI Assistant (@ai)** powered by Google Gemini and in-browser code execution using **WebContainers** and a **Browser Live Fallback Engine**.

---

## 🌟 Core Features

- ⚡ **Real-Time Code Collaboration**: Multi-user live project rooms with synchronized file editing, cursor presence, and chat via Socket.io.
- 🏗️ **Modular Enterprise Architecture**: Fully decomposed, single-responsibility micro-components (< 300 lines each) across frontend and backend.
- ✏️ **Interactive Message Editing & Deletion**: Hover glass action bar on message bubbles with bottom input edit mode, keyboard shortcuts (`Enter`/`Esc`), and real-time socket sync (`project-message-edit`, `project-message-delete`).
- 💬 **Sleek Message Options & Reaction Popovers**: Glassmorphic options menu and emoji reaction bar (`👍`, `❤️`, `🔥`, `😂`, `🎉`, `🚀`) with hover-only visibility and collision-free directional positioning.
- 🏷️ **@Mentions System & Header Navigation**: Auto-complete popover with keyboard navigation (`Up`/`Down`/`Enter`/`Esc`) and header mention counter pill (`@ Mention X of Y`) that smooth-scrolls directly to mentioned messages.
- 🤖 **Integrated AI Assistant**: Ask questions, refactor code, or generate features directly in the workspace using `@ai`.
- 🌐 **Dual-Engine Preview System**:
  - **Chromium / Firefox Engine**: Native StackBlitz WebContainers (`@webcontainer/api`) WASM engine for in-browser Node.js/React apps.
  - **Safari & Mobile Live Fallback Engine**: CommonJS `require()` polyfill, `@babel/standalone` in-browser transpilation, and static asset inlining (`public/style.css`, `public/script.js`) for 100% identical live previews on Safari & iOS.
- 📁 **Dynamic File & Directory Explorer**: VS Code-inspired minimal file tree with extension-specific Lucide icons, custom folder color-coding, and an icon-only `[◧]` chat toggle.
- 💻 **Monaco Code Editor**: VS Code-powered code editing experience with syntax highlighting and multi-tab management.
- 🔐 **Secure Authentication & Token Management**: JWT authentication paired with Redis-backed token blacklisting for secure logouts.
- ⚡ **Optimized Data Layer**: Redux Toolkit state management, cached React Query data layer, and Mongoose ODM.

---

## 🏗️ Tech Stack

### **Frontend (`/frontend`)**
* **Core**: React 18, Vite, JavaScript (ES6+ / JSX)
* **Styling & UI**: Tailwind CSS, Framer Motion, Lucide React Icons
* **Code Editor**: `@monaco-editor/react`
* **In-Browser Execution**: `@webcontainer/api`, `coi-serviceworker`
* **State Management**: Redux Toolkit (`@reduxjs/toolkit`), React Redux, TanStack React Query (`@tanstack/react-query`), React Context API
* **Real-Time Communication**: `socket.io-client`
* **HTTP Client**: Axios

### **Backend (`/backend`)**
* **Runtime & Framework**: Node.js, Express.js
* **Database & ODM**: MongoDB, Mongoose
* **Caching & Security**: Redis (Token Blacklisting)
* **Real-Time Engine**: Socket.io (Modularized Sockets Layer)
* **AI Integration**: `@google/generative-ai` (Gemini API)
* **Authentication**: JSON Web Tokens (JWT), bcrypt

---

## 📂 Project Directory Structure

```text
ChatCraft/
├── backend/
│   ├── config/             # DB, Redis, Socket, and Axios configurations
│   ├── controllers/        # Route controllers (user, project, ai, etc.)
│   ├── middlewares/        # Auth & validation middlewares
│   ├── models/             # Mongoose schemas (user, project, message)
│   ├── routes/             # Express API route declarations
│   ├── services/           # Services (project.service, fileTree.service, ai.service, message.service)
│   ├── sockets/            # Modular Socket.io handlers (projectSockets.js)
│   ├── utils/              # Helper utilities
│   ├── .env                # Backend environment variables
│   ├── app.js              # Express app setup
│   └── server.js           # Streamlined HTTP & Socket.io server entry point
│
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # UI Components
│   │   │   ├── HomePage/
│   │   │   │   ├── StatsSidebar/     # Modularized Stats Sidebar components
│   │   │   │   ├── AvatarPicker.jsx
│   │   │   │   └── ProjectCard.jsx
│   │   │   └── ProjectPage/
│   │   │       ├── Chat/
│   │   │       │   ├── ChatMessageBubble/ # AIMessageCard, UserMessageCard, CollaboratorMessageCard, helpers.jsx
│   │   │       │   ├── ChatInput/         # useVoiceRecorder hook, EmojiPicker, MentionsDropdown
│   │   │       │   └── ChatMessages/      # UnreadMentionsBanner & message stream
│   │   │       └── Code/
│   │   │           ├── ArchitectureVisualizer/ # OverviewTab, SystemGraphTab, ThreeTierTab, etc.
│   │   │           └── CodeEditor/             # CodeEditor layout & previewUtils
│   │   ├── config/         # Axios, Socket, and WebContainer clients
│   │   ├── contexts/       # React Context Providers (user, project, chat, codeEditor)
│   │   ├── pages/          # Page components (Home, Project, Auth, Landing)
│   │   ├── store/          # Redux Store & Slices (chatSlice, editorSlice, userSlice)
│   │   ├── utils/          # File tree normalization & tree helpers
│   │   └── main.jsx        # React application entry point
│   ├── .env                # Frontend environment variables
│   └── vite.config.js      # Vite build configuration
│
├── handover.md             # AI Agent Handover Documentation
└── README.md               # Project documentation
```

---

## 📊 Codebase Modularization & Refactoring Overview

All major monolithic components have been refactored into focused, single-responsibility sub-directories:

| Component / Module | Initial Line Count | Final Line Count | Line Reduction | Extracted Sub-Modules |
|---|---|---|---|---|
| **`server.js` (Backend)** | **442 lines** | **18 lines** | **⬇️ 95.9%** | `backend/sockets/projectSockets.js` |
| **`ArchitectureVisualizer`** | **1,279 lines** | **340 lines** | **⬇️ 73.4%** | `OverviewTab`, `SystemGraphTab`, `ThreeTierTab`, `ApiRoutesTab`, `ImportsTab`, `FilesTab`, `DependenciesTab` |
| **`ChatMessageBubble`** | **1,064 lines** | **295 lines** | **⬇️ 72.3%** | `AIMessageCard`, `UserMessageCard`, `CollaboratorMessageCard`, `helpers.jsx`, `AudioPlayer`, `MessageContextMenu` |
| **`CodeEditor`** | **670 lines** | **330 lines** | **⬇️ 50.7%** | `previewUtils.js`, `FileTree`, `TabsBar`, `EditorPane`, `PreviewPane` |
| **`ChatInput`** | **608 lines** | **314 lines** | **⬇️ 48.4%** | `useVoiceRecorder.js`, `EmojiPickerPopover`, `MentionsDropdown`, `VoiceRecorderBar`, `ReplyEditBanner` |
| **`StatsSidebar`** | **321 lines** | **87 lines** | **⬇️ 72.9%** | `UserProfileCard.jsx`, `WorkspaceMetricsCard.jsx` |
| **`project.service.js`** | **397 lines** | **335 lines** | **⬇️ 15.6%** | `backend/services/fileTree.service.js` |

---

## ⚙️ Environment Variables Setup

### **Backend Environment (`backend/.env`)**
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/chatcraft
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=ChatCraft_Secret_Key
CLIENT_URL_DEV=http://localhost:5173
```

### **Frontend Environment (`frontend/.env`)**
```env
VITE_SERVER_URL=http://localhost:3000
```
