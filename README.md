# School CEO Dashboard

A comprehensive dashboard for school management with analytics, staff management, admissions tracking, and parent query handling.

## Project Structure

```
school-ceo-dashboard/
├── app/                    # Next.js app directory
├── components/             # React components
├── backend/               # Express.js backend
│   ├── routes/           # API routes
│   ├── models/           # Data models
│   └── middleware/       # Custom middleware
├── lib/                  # Utility libraries
└── public/              # Static assets
```

## Features

- **Dashboard Analytics**: Student performance, admissions trends, retention rates
- **Staff Management**: Add, edit, delete staff members
- **Admissions Tracking**: Manage student applications and status
- **Parent Queries**: Handle parent inquiries and support requests
- **Authentication**: Login/register system
- **Responsive Design**: Works on desktop and mobile

## Quick Start

### Option 1: Run Both Servers (Recommended)
```bash
# Double-click start-servers.bat or run:
start-servers.bat
```

### Option 2: Manual Setup

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

3. **Start Backend Server**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

4. **Start Frontend Server** (in new terminal)
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify token

### Staff Management
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Create staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

### Admissions
- `GET /api/admissions` - Get all admissions
- `POST /api/admissions` - Create admission
- `PUT /api/admissions/:id` - Update admission
- `DELETE /api/admissions/:id` - Delete admission

### Parent Queries
- `GET /api/queries` - Get all queries
- `POST /api/queries` - Create query
- `PUT /api/queries/:id` - Update query
- `DELETE /api/queries/:id` - Delete query

### Analytics
- `GET /api/analytics/student-performance` - Student performance data
- `GET /api/analytics/admissions` - Admissions analytics
- `GET /api/analytics/retention` - Retention analytics
- `GET /api/analytics/health-index` - Institutional health metrics
- `GET /api/analytics/parent-trust` - Parent trust index

## Default Login Credentials

- **Admin**: admin@school.edu / admin123
- **CEO**: ceo@school.edu / ceo123

## Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts (for analytics)
- Radix UI (components)

### Backend
- Node.js
- Express.js
- CORS enabled
- RESTful API design

## Development

- Frontend runs on port 3000
- Backend runs on port 5000
- Hot reload enabled for both servers
- CORS configured for local development

## VS Code Integration

The project includes VS Code configuration for:
- Tasks (Ctrl+Shift+P → "Tasks: Run Task")
- Debug configurations
- TypeScript support
- ESLint integration