# School CEO Dashboard - How It Works

## Architecture Overview

### Frontend (Next.js + React)
- **Port**: 3000
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS + Radix UI components
- **State**: React Context API for data management
- **Charts**: Recharts for analytics visualization

### Backend (Node.js + Express)
- **Port**: 5000
- **Framework**: Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens + bcrypt password hashing
- **CORS**: Enabled for frontend communication

### Database (MongoDB)
- **URL**: mongodb://localhost:27017/school_ceo_dashboard
- **Collections**: users, staff, admissions, queries
- **Features**: Real-time data, automatic timestamps

## Data Flow

```
Frontend (React) → API Calls → Backend (Express) → MongoDB → Response → Frontend
```

## How Each Feature Works

### 1. Authentication System
- **Login**: Email/password → bcrypt verification → JWT token
- **Registration**: Password hashing → MongoDB storage → JWT token
- **Token Verification**: JWT validation for protected routes

### 2. Staff Management
- **CRUD Operations**: Create, Read, Update, Delete staff records
- **Data**: Name, email, department, position, join date, experience
- **Real-time**: All changes immediately reflected in database

### 3. Admissions Tracking
- **Application Management**: Student applications with parent details
- **Status Tracking**: Pending → Approved/Rejected workflow
- **Analytics**: Real-time admission statistics from database

### 4. Parent Queries System
- **Query Submission**: Parents submit questions/concerns
- **Priority Management**: Low/Medium/High priority levels
- **Status Workflow**: Open → In Progress → Resolved

### 5. Analytics Dashboard
- **Real-time Calculations**: All metrics calculated from live database data
- **Health Index**: Based on staff retention, query resolution, admission success
- **Performance Metrics**: Dynamic calculations, no hardcoded values

## API Endpoints Structure

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - New user registration
- `GET /api/auth/verify` - Token validation

### Data Management
- `GET/POST/PUT/DELETE /api/staff` - Staff CRUD operations
- `GET/POST/PUT/DELETE /api/admissions` - Admission CRUD operations
- `GET/POST/PUT/DELETE /api/queries` - Query CRUD operations

### Analytics (Real-time from DB)
- `GET /api/analytics/student-performance` - Student metrics
- `GET /api/analytics/admissions` - Admission statistics
- `GET /api/analytics/retention` - Staff retention data
- `GET /api/analytics/health-index` - Institutional health metrics
- `GET /api/analytics/parent-trust` - Parent satisfaction metrics

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'ceo',
  timestamps: true
}
```

### Staff Collection
```javascript
{
  name: String,
  email: String (unique),
  department: String,
  position: String,
  joinDate: Date,
  status: 'Active' | 'Inactive',
  experience: Number,
  timestamps: true
}
```

### Admissions Collection
```javascript
{
  studentName: String,
  parentName: String,
  email: String,
  phone: String,
  grade: String,
  status: 'Pending' | 'Approved' | 'Rejected',
  applicationDate: Date,
  documents: [String],
  notes: String,
  timestamps: true
}
```

### Queries Collection
```javascript
{
  parentName: String,
  email: String,
  phone: String,
  studentName: String,
  subject: String,
  message: String,
  status: 'Open' | 'In Progress' | 'Resolved',
  priority: 'Low' | 'Medium' | 'High',
  response: String,
  assignedTo: String,
  timestamps: true
}
```

## How to Run

### Prerequisites
1. **MongoDB**: Running on localhost:27017
2. **Node.js**: Version 16+ installed

### Setup Steps
```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Seed database (first time only)
cd backend && npm run seed && cd ..

# 3. Start both servers
start-servers.bat
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Login**: admin@school.edu / admin123

## Key Features

### Security
- JWT authentication with secure tokens
- Password hashing with bcrypt (12 rounds)
- CORS protection for API endpoints
- Input validation and error handling

### Real-time Data
- All analytics calculated from live database
- No mock data or hardcoded values
- Instant updates when data changes
- MongoDB aggregation for complex queries

### Scalability
- RESTful API design
- Modular component architecture
- Database indexing for performance
- Environment-based configuration

### User Experience
- Responsive design (mobile + desktop)
- Real-time dashboard updates
- Intuitive navigation with sidebar
- Form validation and error messages

## Development Workflow

1. **Frontend Changes**: Edit React components → Hot reload
2. **Backend Changes**: Edit Express routes → Nodemon restart
3. **Database Changes**: Update Mongoose models → Restart required
4. **New Features**: Add routes → Update frontend → Test integration

The entire system is now fully integrated with MongoDB, providing persistent data storage and real-time analytics without any mock data.