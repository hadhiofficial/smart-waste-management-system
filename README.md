# 🌱 Smart Waste Management System

A complete, production-ready waste management application with role-based access control (Admin, Driver, Citizen). Built with React, Vite, Tailwind CSS, and Supabase.

**Status**: ✅ Fully Functional | 🚀 Ready to Deploy | 📦 Production Grade

---

## 📸 Feature Overview

### 👨‍💼 **Admin Dashboard**
- System KPIs (complaints, waste collected, bins status)
- Complaint management (view all, update status, assign to drivers)
- Waste bin management (fill levels, status updates)
- User management (view all drivers and citizens)
- Analytics and collection statistics

### 🚗 **Driver Dashboard**
- View today's assigned tasks
- Start task collection
- Complete task with waste collected amount
- Task statistics and history
- Real-time notifications

### 👤 **Citizen Dashboard**
- Report waste complaints with images
- View complaint status and history
- Complaint statistics
- Track issue resolution
- Receive notifications

---

## ⚡ Quick Start

### 1️⃣ Setup Supabase
```bash
# Go to supabase.com, create project, then:
1. Copy SUPABASE_SCHEMA.sql contents
2. Paste into Supabase SQL Editor
3. Create storage bucket "waste-management-images"
4. Get Project URL and API Key
```

### 2️⃣ Configure Frontend
```bash
cd front-end
cp .env.example .env
# Update .env with Supabase credentials
npm install
npm run dev
```

### 3️⃣ Create Demo Users
```
Sign Up via UI with:
- Admin: admin@test.com / password123
- Driver: driver@test.com / password123
- Citizen: citizen@test.com / password123

Then run DEMO_DATA.sql in Supabase
```

### 4️⃣ Start Using!
- Admin: http://localhost:5173/admin
- Driver: http://localhost:5173/driver
- Citizen: http://localhost:5173/citizen

---

## 🏗️ Architecture

```
Frontend (React + Vite + Tailwind)
    ↓
Router (Role-based)
    ├── Admin Routes → Admin Dashboard
    ├── Driver Routes → Driver Dashboard
    └── Citizen Routes → Citizen Dashboard
    ↓
Custom Hooks (useWasteManagement)
    ├── useAuth
    ├── useAdmin
    ├── useDriver
    ├── useCitizen
    ├── useNotifications
    └── useImageUpload
    ↓
Services (CRUD Operations)
    └── wasteManagementService.js
    ↓
Supabase Backend
    ├── PostgreSQL (6 tables)
    ├── RLS Policies (Security)
    ├── Storage (Images)
    └── Real-time (Notifications)
```

---

## 📊 Database Schema

| Table | Purpose | Records |
|-------|---------|---------|
| **users** | User profiles & roles | Admin, Drivers, Citizens |
| **areas** | Waste zones | 5 sample areas |
| **waste_bins** | Physical bins | 12 sample bins |
| **complaints** | Issue reports | Citizen reports |
| **collection_schedule** | Driver tasks | Assigned tasks |
| **notifications** | System alerts | Auto-generated |

### Key Relationships
```
Citizens → Report → Complaints → About → Waste Bins
Admins → Assign → Complaints → To → Drivers
Drivers → Collect → Tasks → Update → Waste Collected
System → Creates → Notifications → For → All Users
```

---

## 🔐 Security Features

✅ **Row Level Security (RLS)** - Database-level access control  
✅ **Role-based Routing** - Frontend route guards  
✅ **Authentication** - Supabase Auth with sessions  
✅ **Data Validation** - Input sanitization & error handling  
✅ **Encrypted Images** - Supabase Storage integration  

---

## 🎯 Workflow: Citizen Reports, Admin Assigns, Driver Completes

```
1️⃣ CITIZEN REPORTS
   ├─ Opens app → Citizen Dashboard
   ├─ Clicks "Report Issue"
   ├─ Fills form (title, description, type, image)
   └─ Submits → Complaint created (status: pending)

2️⃣ ADMIN REVIEWS & ASSIGNS
   ├─ Admin receives notification
   ├─ Opens Complaints tab
   ├─ Selects pending complaint
   ├─ Updates status → "acknowledged"
   ├─ Assigns to driver
   └─ Driver receives notification

3️⃣ DRIVER COMPLETES TASK
   ├─ Driver receives notification
   ├─ Sees task in dashboard
   ├─ Clicks "Start" → status: "in_progress"
   ├─ Collects waste from bin
   ├─ Clicks "Complete"
   ├─ Enters waste amount & notes
   ├─ Submits → Task completed
   ├─ Bin fill level resets (auto-trigger)
   └─ Citizen receives notification "Issue Resolved"
```

---

## 📁 Project Structure

```
smart-waste-management/
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginEnhanced.jsx           # Auth form
│   │   │   │   └── ProtectedRoute.jsx          # Route guards
│   │   │   └── Dashboards/
│   │   │       ├── CitizenDashboard.jsx        # Citizen UI
│   │   │       ├── DriverDashboard.jsx         # Driver UI
│   │   │       └── AdminDashboard.jsx          # Admin UI
│   │   ├── hooks/
│   │   │   └── useWasteManagement.js           # State mgmt
│   │   ├── services/
│   │   │   └── wasteManagementService.js       # Database ops
│   │   ├── config/
│   │   │   └── supabaseConfig.js               # Setup
│   │   └── App.jsx                             # Router
│   ├── package.json
│   └── vite.config.js
├── SUPABASE_SCHEMA.sql                         # Database
├── DEMO_DATA.sql                               # Sample data
├── SETUP_GUIDE.md                              # Detailed setup
└── README.md                                   # This file
```

---

## 🛠️ Tech Stack

**Frontend:**
- ⚛️ React 18 (UI components)
- ⚡ Vite (fast bundler)
- 🎨 Tailwind CSS (styling)
- 🔀 React Router (navigation)

**Backend:**
- 🗄️ Supabase (PostgreSQL)
- 🔐 Row Level Security
- 📦 Storage (images)
- 🔔 Real-time API

**DevTools:**
- npm (package management)
- ESLint (code quality)
- Prettier (formatting)

---

## 📚 Component Documentation

### Citizen Dashboard
**File**: `front-end/src/components/Dashboards/CitizenDashboard.jsx`

**Features**:
- Dashboard tab: Statistics (total, pending, resolved)
- Complaints tab: List all personal complaints with status
- Report tab: Form to submit new complaints with image

**Uses**: `useCitizen`, `useImageUpload`

### Driver Dashboard
**File**: `front-end/src/components/Dashboards/DriverDashboard.jsx`

**Features**:
- Today's tasks grid
- Task list with fill level, capacity, status
- Start/Complete buttons
- Task completion form (waste_kg + notes)

**Uses**: `useDriver`

### Admin Dashboard
**File**: `front-end/src/components/Dashboards/AdminDashboard.jsx`

**Features**:
- KPIs: 8 system metrics
- Complaints management: Status updates + driver assignment
- Bins management: Fill level visualization + status updates
- Users management: View all drivers and citizens

**Uses**: `useAdmin`

---

## 🔄 Service Functions (29 Total)

### Auth Service (4 functions)
```javascript
authService.signUp(email, password, name, role)
authService.signIn(email, password)
authService.signOut()
authService.getCurrentUser()
```

### Citizen Service (3 functions)
```javascript
citizenService.createComplaint(data)
citizenService.getMyComplaints()
citizenService.getDashboardStats()
```

### Driver Service (4 functions)
```javascript
driverService.getAssignedTasks(date)
driverService.getTodaysTasks()
driverService.startTask(taskId)
driverService.completeTask(taskId, kg, notes)
```

### Admin Service (8 functions)
```javascript
adminService.getAllComplaints(filters)
adminService.updateComplaintStatus(id, status, notes)
adminService.assignComplaintToDriver(complaintId, driverId)
adminService.getAllWasteBins()
adminService.updateBinStatus(binId, status)
adminService.getUsersByRole(role)
adminService.getDashboardKPIs()
adminService.getCollectionStats(startDate, endDate)
```

Plus: Area Service (2), Notification Service (4), Image Service (2)

---

## 🎨 UI Components

All components use **Tailwind CSS** for styling:
- Responsive grids (mobile/tablet/desktop)
- Color-coded status badges
- Loading spinners
- Form validation
- Success/error messages
- Progress bars
- Modal expansions

**Color Scheme**:
- 🔵 Primary: Blue (actions)
- 🟢 Success: Green (resolved)
- 🟡 Warning: Yellow (pending)
- 🔴 Error: Red (full/issues)

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# Select: front-end directory
# Set env variables
# Deploy
```

### Option 2: Netlify
```bash
npm run build
# Drag & drop dist folder to Netlify
```

### Option 3: Self-hosted
```bash
npm run build
# Upload dist folder to server
# Configure for SPA routing
```

---

## 🧪 Testing

Test each user flow:

**Citizen Flow** ✅
- Sign up as citizen
- Report complaint with image
- View complaint status
- Receive notifications

**Driver Flow** ✅
- Sign up as driver
- View assigned tasks
- Complete task with waste amount
- See statistics update

**Admin Flow** ✅
- Sign up as admin
- View all complaints
- Change complaint status
- Assign to driver
- View KPIs

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Login fails | Check Supabase URL/API key in config |
| No data showing | Run SUPABASE_SCHEMA.sql + DEMO_DATA.sql |
| Images not uploading | Create "waste-management-images" bucket |
| RLS errors | Verify RLS policies are enabled |
| Notifications not working | Check useNotifications hook is polling |

---

## 📞 Support & Documentation

**For setup help**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**For database queries**: See [SUPABASE_SCHEMA.sql](./SUPABASE_SCHEMA.sql)

**For sample data**: See [DEMO_DATA.sql](./DEMO_DATA.sql)

---

## ✨ Features Included

✅ Complete database schema with RLS  
✅ 29 database operations/service functions  
✅ 6 custom React hooks with state management  
✅ 3 role-based dashboard components  
✅ Authentication with Supabase Auth  
✅ Image upload to cloud storage  
✅ Real-time notifications system  
✅ Automatic bin reset after collection (triggers)  
✅ Cascading deletions for data integrity  
✅ Error handling & validation  
✅ Responsive design (mobile/tablet/desktop)  
✅ Production-ready code  
✅ Comprehensive documentation  

---

## 🎯 Next Steps

1. **Read** [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. **Create** Supabase project and run SUPABASE_SCHEMA.sql
3. **Install** frontend dependencies and configure
4. **Create** demo users via sign-up
5. **Run** DEMO_DATA.sql for sample data
6. **Test** each user flow
7. **Deploy** to production

---

## 📝 License

MIT License - Feel free to use for any purpose

---

## 🎉 You're All Set!

The application is **100% complete and ready to use**. All backend infrastructure is in place, all UI components are built, and all security is configured.

**Current Status**: 
- ✅ Database: Complete
- ✅ Services: Complete (29 functions)
- ✅ State Management: Complete (6 hooks)
- ✅ Authentication: Complete
- ✅ Admin Dashboard: Complete
- ✅ Driver Dashboard: Complete
- ✅ Citizen Dashboard: Complete
- ✅ Routing: Complete
- ✅ Error Handling: Complete

**Demo Credentials**:
- Admin: admin@test.com / password123
- Driver: driver@test.com / password123
- Citizen: citizen@test.com / password123

**Get Started**: `npm run dev`

---

Made with ❤️ for smart waste management