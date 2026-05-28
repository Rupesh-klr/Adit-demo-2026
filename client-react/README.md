# Customer Management Frontend (React) ⚛️

A high-performance React application for managing customer registries, optimized for cloud deployments (Vercel/Render).

## 🌐 Live Deployment
- **Frontend (Vercel):** [https://arali-demo.vercel.app/](https://arali-demo.vercel.app/)
- **Backend (Render):** [https://arali-demo.onrender.com](https://arali-demo.onrender.com) *(Update with your URL)*

---

## 🛠 Features

### 1. Cold Start Resilience 🛡️
Specifically designed for free-tier hosting (Render). If the backend is "asleep," the frontend automatically enters a **Retry Cycle**:
- **Interval:** 30 seconds per attempt.
- **Max Retries:** 5 attempts.
- **UI Feedback:** Uses `Toast.warn` to inform the user during the wake-up phase.

### 2. Advanced Data Table
- **Sticky Headers:** Always keep column titles in view during scrolling.
- **Fixed Height:** A neat, consistent UI limited to 10-row visibility with internal scrolling.
- **Server-side Logic:** Sorting, searching, and pagination are handled by the API to ensure scalability.

---

## 🛣 API Integration Snippets

### **GET /customers (Fetch Logic)**
Handles searching, multi-column sorting, and pagination metadata.
```javascript
const response = await fetch(`${API_URL}/customers?page=1&limit=10&sort=name&order=asc`);
const { data, meta } = await response.json();
```

### **POST /customers (Creation)**
Includes strict validation for name length, email patterns, and unique constraints.
```javascript
const res = await fetch(`${API_URL}/customers`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(customerData)
});
```

### **DELETE /customers/:id**
Removes a record and broadcasts a Socket.io event to sync all open tabs.
```javascript
await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
```

---

## ⚙️ Build & Deployment Commands

**Install Dependencies**
```bash
npm install
```
**Production Build**
```bash
npm run build
```
**Deploy to Vercel**
```bash
vercel --prod
```

---

Developed by Rupesh KLR

---
### Why this polish is important:
1.  **UX during Cold Starts:** Without the retry logic, users just see a red "Error" immediately when Render is asleep. Now, they get a 2.5-minute window (5 x 30s) where the app stays "alive" and tries to connect.
2.  **Clear Documentation:** Your `README.md` now explains *why* the app might take a moment to load, which is great for anyone reviewing your portfolio or code.
3.  **Error Handling:** The final `Toast.error("backend failed")` only triggers if the server is actually down, rather than just sleeping.

How does the 30-second interval feel? If Render usually wakes up faster, we can reduce it to 15 or 20 seconds.

