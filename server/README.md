# Customers Management API Server 🚀

A robust Node.js backend designed for managing customer and employee registries. This server features real-time synchronization via Socket.io, automated backups, and built-in logging.

## 🌐 Live Endpoints
- **Main API Service:** [https://arali-demo.vercel.app](https://arali-demo.vercel.app) *(Update this with your specific Render URL)*
- **Interactive Documentation (Swagger):** [https://arali-demo.onrender.com/api-docs](https://arali-demo.onrender.com/api-docs)

---

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time:** Socket.io
- **Documentation:** Swagger (OpenAPI 3.0)
- **Utilities:** UUID (ID Generation), Dotenv (Config), Cookie-Parser

---

## 📖 Features

### 1. API Documentation (Swagger)
The API is fully documented using Swagger UI. You can test all endpoints (GET, POST, DELETE) directly from the browser.
- **Route:** `/api-docs`

### 2. Real-time Updates
The server uses WebSockets to emit events whenever the database is modified:
- `customer_added`: Emitted when a new record is created.
- `customer_deleted`: Emitted when a record is removed.

### 3. Data Persistence & Maintenance
- **Automatic Backups:** The server performs a full JSON backup every 5 minutes to `customers-backup.json`.
- **Validation:** Includes strict checks for email uniqueness and phone number formatting.

### 4. Remote Log Viewer
A built-in custom log viewer allows you to monitor server activity in real-time without SSH access.
- **Route:** `/lastlog`
- **lastlog :** [https://arali-demo.onrender.com/lastlog](https://arali-demo.onrender.com/lastlog)


---

## 🚀 Local Installation

## 🛠 1. Installation & Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/Rupesh-klr/Arali-demo.git
   cd server
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   ALLOWED_ORIGIN=http://localhost:5173
   ```

3. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

---

## 📖 2. API Documentation (Swagger)
Once the server is running, you can access the interactive API documentation at:
- [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🛣 3. Endpoint Details (2-Line Summary)
- **GET /customers:** Fetches the registry with support for multi-column search, dynamic sorting, and server-side pagination. It returns both the data array and a metadata object.
- **POST /customers:** Creates a new record after verifying that the email and phone number do not already exist in the database. It generates a unique UUID and broadcasts the change via WebSockets.
- **DELETE /customers/:id:** Locates a specific record by its ID and removes it from the persistent JSON storage. It triggers a real-time deletion event to sync all open dashboard windows.
- **GET /api/health:** A lightweight monitoring endpoint that returns the current server status and active environment mode. It is used by hosting platforms to ensure the service is running.
- **GET /lastlog:** A custom internal tool that reads the server's .log files and renders them in a dark-themed web interface for remote monitoring.

---

## 🔍 4. API Logic Snippets
**Fetch with Pagination & Search:**
```js
const response = await fetch(`${API_URL}/customers?limit=10&page=1&search=test`);
const result = await response.json();
```
**Add New Record:**
```js
const res = await fetch(`${API_URL}/customers`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: "Rupesh", email: "test@test.com", phone: "1234567890" })
});
```
**Remove Record:**
```js
await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
```

---

## ⚙️ 5. Build & Deployment Commands
Use these exact commands for deploying to hosting providers:

**Build Project**
```bash
npm run build
```
**Start Service**
```bash
npm start
```
**Check Health Status**
```bash
curl http://localhost:5000/api/health
```

---




### Why this README is effective for you:
1.  **Strict Syntax:** All code blocks use triple backticks (\`\`\`) with the language specified (`bash`, `env`), making them perfectly copy-pasteable into VS Code or any text editor.
2.  **Logic-First:** It separates the **Installation** (Step 1) from the **Endpoints** (Step 3), making it easy for other developers to understand your code flow.
3.  **Real-time Context:** It highlights your **Socket.io** and **Logging** features, which are the most advanced parts of your server.

**Quick Tip:** After you paste this into your `README.md`, you can press `Cmd + Shift + V` in VS Code to see a beautiful preview of how it will look on GitHub or Render!


---

Developed by Rupesh KLR
