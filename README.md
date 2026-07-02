# Smart Attendance Management System

A production-ready MERN attendance platform for Students, Teachers, and HOD users. It includes JWT authentication, role-based authorization, QR attendance, leave workflows, notifications, Chart.js analytics, PDF export, Excel export, dark mode, and responsive dashboards.

## Tech Stack

- React.js with Vite
- Node.js and Express.js
- MongoDB with Mongoose
- JWT authentication and bcrypt password hashing
- React Router, Axios, Tailwind CSS
- Chart.js, jsPDF, SheetJS
- Nodemailer and QR code generation

## Project Structure

```text
client/
  src/
    components/
    context/
    hooks/
    layouts/
    pages/
    services/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

3. Start MongoDB locally or update `MONGO_URI` in `server/.env`.

4. Seed demo data:

```bash
npm run seed
```

5. Run the full application:

```bash
npm run dev
```

The client runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Demo Accounts

All seeded users use this password:

```text
Password@123
```

- Student: `student@sams.edu`
- Teacher: `teacher@sams.edu`
- HOD: `hod@sams.edu`

## API Overview

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/dashboard/overview`
- `GET /api/attendance`
- `POST /api/attendance`
- `PUT /api/attendance/:id`
- `DELETE /api/attendance/:id`
- `POST /api/attendance/qr`
- `GET /api/leaves`
- `POST /api/leaves`
- `PATCH /api/leaves/:id/review`
- `GET /api/users`
- `GET /api/users/students/list`
- `GET /api/users/teachers/list`
- `GET /api/academic/departments`
- `GET /api/academic/subjects`

## Attendance Collection

The attendance model includes:

```text
studentId
teacherId
subjectId
department
semester
section
date
status
remarks
markedBy
createdAt
```

## Notes

Nodemailer uses JSON transport when SMTP settings are not provided, so password reset and alert flows run in local development without an external mail service. Configure SMTP variables in production.
