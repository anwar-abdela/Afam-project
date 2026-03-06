---
description: How to run the Artic Sync project locally
---

# Local Run Workflow

Perform these steps in two separate terminal sessions.

### Step 1: Database Check
Ensure **Postgres** is running on your system. The backend expects a database named `shop_db`.

### Step 2: Backend (Terminal 1)
1. In the `backend` folder, run:
   ```powershell
   npm run start:dev
   ```
2. The API will start on [http://localhost:3000](http://localhost:3000).

### Step 3: Frontend (Terminal 2)
1. In the `frontend` folder, run:
   ```powershell
   npm run dev
   ```
2. The portal will be available on [http://localhost:5173](http://localhost:5173).

---
> [!NOTE]
> Ensure the `.env` file in the `backend` directory has your correct Postgres credentials.
