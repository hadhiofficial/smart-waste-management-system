# Smart Waste Management System - Setup Guide

Complete production-ready Smart Waste Management application with role-based access control (Admin, Driver, Citizen).

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free at supabase.com)
- Git

### 1. Setup Supabase Backend

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **API Key** (anon key)

#### Step 2: Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the contents of `SUPABASE_SCHEMA.sql`
3. Run the query (this creates all tables, indexes, RLS policies, and triggers)

#### Step 3: Create Storage Bucket
1. In Supabase dashboard, go to **Storage**
2. Create a new bucket named `waste-management-images` (public or private based on preference)

#### Step 4: Update Supabase Config
Update `front-end/src/config/supabaseConfig.js`:
```javascript
const SUPABASE_URL = 'your-project-url-here'; // from Supabase dashboard
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // from Supabase dashboard
```

### 2. Setup Frontend

```bash
cd front-end
npm install
npm run dev
```

Application will start at `http://localhost:5173`

## 🔐 Demo Credentials

After running `DEMO_DATA.sql`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | password123 |
| Driver | driver@test.com | password123 |
| Citizen | citizen@test.com | password123 |

To create demo users:
1. Go to application login page
2. Click "Sign Up" for each role
3. Use the credentials above
4. Run `DEMO_DATA.sql` in Supabase to populate with sample data

## 📁 Project Structure

```
smart-waste-management/
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginEnhanced.jsx        # Login form
│   │   │   │   └── ProtectedRoute.jsx       # Route guards
│   │   │   └── Dashboards/
│   │   │       ├── CitizenDashboard.jsx     # Citizen UI
│   │   │       ├── DriverDashboard.jsx      # Driver UI
│   │   │       └── AdminDashboard.jsx       # Admin UI
│   │   ├── hooks/
│   │   │   └── useWasteManagement.js        # State management
│   │   ├── services/
│   │   │   └── wasteManagementService.js    # Database operations
│   │   ├── config/
│   │   │   └── supabaseConfig.js            # Supabase setup
│   │   └── App.jsx                          # Main router
│   ├── package.json
│   └── vite.config.js
├── SUPABASE_SCHEMA.sql          # Database schema
├── DEMO_DATA.sql                # Sample data
└── README.md
```

## 🗄️ Database Schema

### Tables
- **users**: User profiles with roles (admin/driver/citizen)
- **areas**: Waste collection zones with geolocation
- **waste_bins**: Physical bins with fill level tracking
- **complaints**: Citizen reports with status workflow (pending → acknowledged → in_progress → resolved)
- **collection_schedule**: Driver task assignments
- **notifications**: System notifications with read status

### Key Relationships
- Citizens report complaints about waste bins
- Admins assign complaints to drivers
- Drivers complete collection tasks
- System auto-creates notifications for all actions

## 👥 User Roles & Permissions

### 👨‍💼 Admin
- View all complaints and bins
- Update complaint statuses
- Assign complaints to drivers
- View system KPIs and analytics
- Manage all users

**Admin Dashboard includes:**
- System KPIs (total complaints, resolved, waste collected, etc.)
- Complaint management (view all, update status, assign to driver)
- Bin management (view fill levels, update status)
- User management (view all users)

### 🚗 Driver
- View assigned collection tasks
- Start/complete tasks with waste collected amount
- View task history and statistics

**Driver Dashboard includes:**
- Today's tasks
- Task completion form (waste in kg + notes)
- Task statistics (completed, total waste)

### 👤 Citizen
- Report waste complaints with images
- View complaint status
- View complaint history and statistics

**Citizen Dashboard includes:**
- Complaint statistics
- Complaint list with status tracking
- Report new complaint form (title, description, type, image)

## 🔄 Workflow Examples

### Citizen Reports Waste
1. Citizen logs in → goes to Citizen Dashboard
2. Clicks "Report Issue" tab
3. Fills form (title, description, type, optional image)
4. Submits → complaint created with status "pending"
5. Admin receives notification

### Admin Reviews & Assigns
1. Admin logs in → goes to Admin Dashboard
2. Clicks "Complaints" tab
3. Sees all complaints with "Pending" status
4. Clicks edit → selects driver → assigns
5. Complaint status changes to "acknowledged"
6. Driver receives notification

### Driver Completes Task
1. Driver logs in → sees task in dashboard
2. Clicks "Start" → status becomes "in_progress"
3. Collects waste from location
4. Clicks "Complete" → enters waste_kg and notes
5. Submits → task marked complete
6. Bin fill_level auto-resets (trigger)
7. Citizen receives notification

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access own data (except admins)
- Drivers only see assigned tasks
- Citizens only see own complaints
- Enforced at database level

### Authentication
- Supabase Auth with email/password
- Session management
- Auto-logout on token expiry

### Data Validation
- Server-side validation in service layer
- Input sanitization
- Error handling with user-friendly messages

## 🚨 Error Handling

All services return consistent response format:
```javascript
{
  success: true/false,
  data: {...} | null,
  error: "error message" | null
}
```

## 🧪 Testing Checklist

**Citizen Flow:**
- [ ] Sign up as citizen
- [ ] View dashboard stats
- [ ] Report complaint with image
- [ ] Verify complaint appears in "My Complaints"
- [ ] See notification when admin assigns

**Driver Flow:**
- [ ] Sign up as driver
- [ ] View assigned tasks
- [ ] Start a task
- [ ] Complete task with waste amount
- [ ] Verify task marked complete
- [ ] Check stats update

**Admin Flow:**
- [ ] Sign up as admin
- [ ] View all KPIs
- [ ] View all complaints
- [ ] Change complaint status
- [ ] Assign complaint to driver
- [ ] View all bins
- [ ] Change bin status
- [ ] View all users

## 📝 Environment Variables

Create `.env` in front-end directory:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Or update `front-end/src/config/supabaseConfig.js` directly.

## 🐛 Troubleshooting

### Login not working
- Check Supabase URL and API key are correct in config
- Verify user exists in Supabase auth
- Check browser console for errors

### Can't upload images
- Verify storage bucket "waste-management-images" exists
- Check storage bucket permissions (public or authenticated)
- Verify image file size < 10MB

### Data not showing
- Run `SUPABASE_SCHEMA.sql` to create tables
- Run `DEMO_DATA.sql` to populate sample data
- Check RLS policies are enabled for tables
- Verify user has correct role

### Notifications not appearing
- Check notifications table has data
- Verify useNotifications hook is running (10s polling)
- Check browser console for errors

## 📚 API Documentation

All database operations are in `front-end/src/services/wasteManagementService.js`:

### Auth Service
- `signUp(email, password, name, role)` - Create account
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Get current profile

### Citizen Service
- `createComplaint(complaintData)` - Report issue
- `getMyComplaints()` - View own complaints
- `getDashboardStats()` - Get statistics

### Driver Service
- `getAssignedTasks(date)` - View tasks for date
- `getTodaysTasks()` - View today's tasks
- `startTask(taskId)` - Mark task started
- `completeTask(taskId, wasteKg, notes)` - Mark task completed
- `getDashboardStats()` - Get statistics

### Admin Service
- `getAllComplaints(filters)` - View all complaints
- `updateComplaintStatus(complaintId, status, notes)` - Change status
- `assignComplaintToDriver(complaintId, driverId)` - Assign task
- `getAllWasteBins()` - View all bins
- `updateBinStatus(binId, status)` - Change bin status
- `getUsersByRole(role)` - Get users
- `getDashboardKPIs()` - Get system statistics
- `getCollectionStats(startDate, endDate)` - Analytics

## 🎨 UI Preview

### Color Scheme
- Primary: Blue (#1D4ED8)
- Success: Green (#16A34A)
- Warning: Yellow (#CA8A04)
- Error: Red (#DC2626)
- Background: Light gray (#F9FAFB)

### Responsive Design
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3-4 columns
- All components use Tailwind CSS

## 📦 Dependencies

### Frontend
- React 18
- Vite
- React Router
- Supabase JS Client
- Tailwind CSS

### Backend
- Supabase (PostgreSQL)
- PostgREST (auto-generated API)
- Row Level Security (RLS)

## 🤝 Contributing

To extend this application:

1. **Add new role**: 
   - Update roles check constraint in `SUPABASE_SCHEMA.sql`
   - Create new service in `wasteManagementService.js`
   - Create new hook in `useWasteManagement.js`
   - Create new dashboard component

2. **Add new feature**:
   - Create table in schema
   - Create service functions
   - Create custom hook
   - Create UI component

3. **Modify permissions**:
   - Update RLS policies in `SUPABASE_SCHEMA.sql`
   - Re-run schema in Supabase SQL editor

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Update Supabase production project URL and API key
- [ ] Enable RLS on all tables
- [ ] Set up backup schedule in Supabase
- [ ] Configure storage bucket access rules
- [ ] Test all user flows
- [ ] Enable rate limiting in Supabase
- [ ] Set up monitoring/logging
- [ ] Configure email notifications
- [ ] Test with realistic data volume
- [ ] Document any custom business logic

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review Supabase documentation
3. Check console logs for errors
4. Verify database schema was created correctly

---

**Project Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
