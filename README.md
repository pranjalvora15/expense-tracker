# Expense Tracker Application

A MERN stack expense tracker for managing day-to-day spending. Users can create an account, add expenses, search and filter history, view dashboard summaries, and inspect expense details in a responsive UI.

## Features

- User registration and login with JWT authentication
- Add, edit, delete, and view expense details
- Expense history with search, category filter, month filter, and sorting
- Dashboard with total expenses, monthly expenses, recent transactions, and charts
- Category breakdown and monthly trend charts
- Responsive UI for desktop and mobile
- Dark mode support
- Form validation on backend and frontend-friendly API errors

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit and RTK Query
- Tailwind CSS
- shadcn-style UI components
- Recharts
- Lucide React icons

**Backend**

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- Zod validation

## Folder Structure

```txt
Expense Tracker/
  frontend/
    src/
      app/                 Redux store and typed hooks
      components/          Shared layout and UI components
      features/            Auth, dashboard, and expenses feature modules
      lib/                 Constants, API base URL, utilities
      routes/              App routes and protected route wrapper
      styles/              Global Tailwind styles
    package.json
    .env.example

  server/
    src/
      config/              Environment and database configuration
      controllers/         Request handlers
      middleware/          Auth and error middleware
      models/              Mongoose models
      routes/              API route definitions
      utils/               Token helpers
      validations/         Zod request schemas
      app.ts               Express app setup
      server.ts            Server bootstrap
    package.json
    .env.example
```

## Run Locally

### Prerequisites

- Node.js
- MongoDB local instance or MongoDB Atlas connection string

### Backend Setup

```bash
cd server
npm install
```

Create `server/.env` using `server/.env.example` as reference:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, use your Atlas connection string in `MONGO_URI`:

```env
MONGO_URI=mongodb+srv://username:password@cluster-url/expense-tracker?retryWrites=true&w=majority
```

Start the backend:

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` using `frontend/.env.example` as reference:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Build Commands

Backend:

```bash
cd server
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

## Note on Render Free Tier

Render's free tier spins down the backend after 15 minutes of inactivity. The first request after the server sleeps will take 20-30 seconds to respond while it wakes up. Subsequent requests are fast. This is expected behaviour on the free plan.
