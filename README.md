# Arali Customer Management System 👥

A modern Full-Stack Customer Management application featuring a real-time data table, advanced form validation, and automated backend logging. Built with React (Vite) and Node.js.

---

## 🏗 Project Architecture

This repository is divided into two main parts:
- **/server**: Node.js/Express backend with Socket.io and Swagger.
- **/client-react**: React/Tailwind frontend with real-time sync.

---

## 🚀 Quick Start (Local Setup)

Follow these commands to get the entire project running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Rupesh-klr/Arali-demo.git
cd Arali-demo
```

### 2. Setup Backend (Server)
```bash
cd server
npm install
# Create a .env file with:
# PORT=5000
# ALLOWED_ORIGIN=http://localhost:5173,https://yourdomain.com,http://localhost:5174,http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005,http://localhost:3006,http://localhost:3007,http://localhost:3008,http://localhost:3009

npm run dev
```

### 3. Setup Frontend (Client)
Open a new terminal window:
```bash
cd client-react
npm install
# Create a .env file with:
# VITE_API_URL=http://localhost:5000
npm run dev
```

---

## 📂 Detailed Documentation
For specific details on how the logic works, choose a module below:

- **View Backend Details:** [server/README.md](./server/README.md) — Includes API Logic, Swagger setup, and Logging details.
- **View More:** [server-doc](https://github.com/Rupesh-klr/Arali-demo/blob/main/server/README.md) — to know more.
- **View Frontend Details:** [client-react/README.md](./client-react/README.md) — Includes Form validation, Pagination logic, and Retry strategies.
- **View More Details:** [client-react-doc](https://github.com/Rupesh-klr/Arali-demo/blob/main/client-react/README.md) — to know more.

---

## 🌐 Live Environments
| Component | Status      | URL                                   |
|-----------|-------------|---------------------------------------|
| Frontend  | 🚀 Production | https://arali-demo.vercel.app/        |
| Backend   | 🟢 Live      | https://arali-demo.onrender.com       |
| API Docs  | 📖 Interactive| https://arali-demo.onrender.com/api-docs |

---

## ⚙️ Core Logic Highlights
- **Cold Start Recovery:** The frontend includes an automated 5-attempt retry logic (30s intervals) to wake up the Render backend from sleep.
- **Real-time Sync:** Uses Socket.io to push updates to the data table without manual page refreshes.
- **Data Integrity:** Strict regex validation and unique constraint checks for Email and Phone numbers on both client and server.

---

Developed by Rupesh KLR
