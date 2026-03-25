# 🌍 Smart Waste Management System

A **modern, professional, and stunning web application** for smart waste management with real-time tracking, AI-powered analytics, and community engagement. Built with **HTML5, CSS3, Bootstrap 5, Leaflet.js, and Chart.js**.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

---

## 🎯 Features

### 🏠 Landing Page (`index.html`)
- **Hero Section** with animated statistics
- **Features Showcase** with icon cards
- **Modern Navigation** with smooth scrolls
- **Responsive Design** for all devices
- **Call-to-Action** buttons

### 🔐 Authentication (`login.html`)
- **Login & Register Forms** with role selection
- **Three User Roles**: Citizen, Admin, Driver
- **Glassmorphism UI** with smooth animations
- **Password strength validation**
- **Form state management**

### 👤 User Dashboard (`dashboard-user.html`)
- **Quick Actions** for reporting waste
- **Nearby Waste Bins Map** with Leaflet.js
- **Personal Waste Reports** with tracking
- **Statistics Cards** with animations
- **Sidebar Navigation**

### 👨‍💼 Admin Dashboard (`dashboard-admin.html`)
- **Key Performance Metrics** with counters
- **Interactive Charts** (Chart.js):
  - Waste by Area (Doughnut)
  - Bin Status Distribution (Pie)
  - Complaint Trends (Line)
  - Collection Performance (Bar)
- **Bin Management** with search/filter
- **Complaint Tracking** table
- **Driver Task Assignment**

### 🚚 Driver Dashboard (`dashboard-driver.html`)
- **Today's Tasks** with status tracking
- **Collection Route Map** with Leaflet.js
- **Task Statistics** (bins pending, time estimate)
- **Photo Upload** for collection proof
- **Real-time Navigation**

### 📊 Analytics Page (`analytics.html`)
- **Monthly Waste Collection** trends
- **Collection by Area** analysis
- **Complaint Categories** distribution
- **Area-wise Statistics** table
- **Key Insights** and recommendations

### 🗺️ Interactive Map (`map.html`)
- **Waste Bin Markers** colored by status
- **Waste Report Markers** with severity levels
- **Legend** and map controls
- **OpenStreetMap** integration
- **Popup Information** on marker click

### 🗑️ Bin Management (`bin-management.html`)
- **Advanced Search & Filtering** (status, area, type)
- **CRUD Operations** on bins
- **Bulk Actions** (schedule, export, sync)
- **Responsive Table** with sorting
- **Status Indicators**

---

## 📁 Project Structure

```
front-end/
│
├── index.html                   # Landing Page
├── login.html                   # Login & Register
├── dashboard-user.html          # User Dashboard
├── dashboard-admin.html         # Admin Dashboard
├── dashboard-driver.html        # Driver Dashboard
├── analytics.html               # Analytics & Reports
├── map.html                     # Interactive Map
├── bin-management.html          # Bin Management
│
├── css/
│   ├── variables.css            # Design tokens & colors
│   ├── style.css                # Main styles with animations
│   └── responsive.css           # Mobile & layout responsive
│
├── js/
│   ├── app.js                   # Core utilities & globals
│   ├── auth.js                  # Authentication logic
│   ├── data.js                  # Sample data & mock API
│   ├── dashboard.js             # Dashboard functions
│   ├── charts.js                # Chart.js initialization
│   └── map.js                   # Leaflet.js integration
│
├── assets/
│   ├── icons/                   # SVG icons
│   └── images/                  # Background images, illustrations
│
└── README.md                    # This file
```

---

## 🎨 Design System

### Color Palette (Eco-Friendly)
- **Primary Green**: `#10b981` - Main brand color
- **Primary Teal**: `#06b6d4` - Secondary accent
- **Primary Dark**: `#064e3b` - Dark elements
- **Status Colors**: Success (green), Warning (orange), Danger (red), Info (cyan)

### Typography
- **Font Family**: Inter, Plus Jakarta Sans
- **Headlines**: Bold, 1.2 line-height
- **Body**: Regular, 1.6 line-height

### Components
- **Cards**: Glassmorphism with soft shadows
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Forms**: Clean inputs with focus states
- **Badges**: Status indicators
- **Tables**: Sortable, filterable

### Animations
- **Fade In**: 0.3s ease-out
- **Slide Up**: 0.3s ease-out
- **Counter Animation**: 2s ease-out
- **Hover Effects**: Smooth transitions

---

## 🚀 Quick Start

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN libraries)
- Optional: Local server for development

### Installation

1. **Open the project**
   ```bash
   cd front-end
   ```

2. **Start with Local Server** (Recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access in Browser**
   ```
   http://localhost:8000
   http://localhost:8000/index.html
   ```

4. **Or Open Directly** (Limited CORS for maps)
   - Double-click `index.html` in file explorer

---

## 🔐 User Accounts (Demo)

### Test Credentials
All forms accept any email/password for demo purposes:

**Citizen Role**
- Email: `citizen@example.com`
- Password: `Password123`

**Admin Role**
- Email: `admin@example.com`
- Password: `Admin@123`

**Driver Role**
- Email: `driver@example.com`
- Password: `Driver123`

---

## 📚 Key Features Explained

### 1. **Authentication System** (`js/auth.js`)
```javascript
// Check if user is logged in
Auth.isLoggedIn()

// Login
Auth.login(email, password, role)

// Require authentication
Auth.requireAuth()

// Check specific role
Auth.requireRole('admin')
```

### 2. **Dashboard Functions** (`js/dashboard.js`)
```javascript
// Populate stats with animations
populateDashboardStats()

// Create and display tables
populateComplaintsTable()
populateBinsTable()

// Modal operations
openReportModal()
openBinModal()

// Data filtering
filterTable('searchId', 'tableBodyId')
```

### 3. **Chart Integration** (`js/charts.js`)
```javascript
// Initialize all charts
initAllCharts()

// Individual chart functions
initWasteByAreaChart()
initComplaintTrendsChart()
initCollectionPerformanceChart()

// Update chart data
updateChartData('chartName', newData)
```

### 4. **Map Implementation** (`js/map.js`)
```javascript
// Initialize map
initMap('mapElementId')

// Add markers
addWasteBinMarkers()
addWasteReportMarkers()

// Map operations
fitMapBounds()
setMapCenter(lat, lng, zoom)
refreshMarkers()
```

### 5. **Utility Functions** (`js/app.js`)
```javascript
// Modals
Modal.open('modalId')
Modal.close('modalId')

// UI Notifications
UI.toast('Message', 'success')
UI.alert('Title', 'Message')

// Formatting
Format.date(dateString)
Format.number(num)
Format.capitalize(str)

// Storage
Utils.storage.set(key, value)
Utils.storage.get(key)
```

---

## 💾 Data Management

### Mock Data Source (`js/data.js`)
The application uses mock data for demonstration:

```javascript
AppData.wasteBins          // Array of 5 waste bins
AppData.wasteReports       // Array of 4 waste reports
AppData.driverTasks        // Array of 2 driver tasks
AppData.adminStats         // Admin statistics object
AppData.wasteByArea        // Area-wise waste collection
AppData.complaintTrends    // Last 7 days trends
// ... and more
```

### Adding Real Data
Replace mock data with API calls:

```javascript
// Before (mock)
const bins = AppData.wasteBins

// After (API)
async function fetchBins() {
  const response = await fetch('/api/bins')
  return await response.json()
}
```

---

## 🔧 Customization

### 1. **Change Colors**
Edit `css/variables.css`:
```css
:root {
  --primary-green: #10b981;      /* Your brand color */
  --primary-teal: #06b6d4;       /* Secondary color */
  --status-danger: #ef4444;      /* Error color */
}
```

### 2. **Update Branding**
- Logo/Icon: Replace `♻️` emoji with image
- Text: Search "WasteFlow" and replace globally
- Colors: Use color palette variables

### 3. **Add New Pages**
1. Create `page-name.html`
2. Import CSS files
3. Include JS scripts
4. Add navigation link in sidebar/navbar

### 4. **Extend Functionality**
- Add more chart types in `js/charts.js`
- Create new utility functions in `js/app.js`
- Add API integration in new `js/api.js`

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | Latest  | ✅ Full |
| Firefox | Latest  | ✅ Full |
| Safari  | Latest  | ✅ Full |
| Edge    | Latest  | ✅ Full |
| Mobile  | Latest  | ✅ Responsive |

---

## 📦 Dependencies

### CDN Libraries (No Installation Needed)

```html
<!-- Bootstrap 5 (Optional, not used but can be added) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

<!-- Leaflet.js (Maps) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>

<!-- Chart.js (Analytics) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap">
```

---

## 🎯 Development Workflow

### 1. **Front-End Development**
- Use local server for development
- Open browser DevTools (F12)
- Make changes and refresh (Ctrl+R)

### 2. **Testing**
- Test all user roles
- Verify responsive design
- Check cross-browser compatibility
- Validate form inputs

### 3. **Deployment**
- Minify CSS and JS files
- Optimize images
- Enable GZIP compression
- Set proper cache headers

---

## 📊 API Integration (Future)

To connect with a backend, replace mock data with API calls:

```javascript
// Current (Mock)
const bins = AppData.wasteBins

// New (API)
async function getBins() {
  try {
    const response = await fetch('/api/waste-bins')
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Suggested REST Endpoints
- `GET /api/waste-bins` - Fetch all bins
- `POST /api/waste-bins` - Create new bin
- `PUT /api/waste-bins/:id` - Update bin
- `DELETE /api/waste-bins/:id` - Delete bin
- `GET /api/reports` - Fetch reports
- `POST /api/reports` - Create report
- `GET /api/analytics` - Fetch analytics data

---

## 🐛 Troubleshooting

### Map Not Loading
- Ensure Leaflet CDN is loaded
- Check browser console for errors
- Verify `mapContainer` element exists

### Charts Not Showing
- Load Chart.js CDN before `charts.js`
- Verify canvas elements have correct IDs
- Check browser console for JavaScript errors

### Forms Not Working
- Ensure form IDs match in HTML and JS
- Check form submission handlers
- Verify localStorage is not disabled

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file imports order
- Verify CSS variables are defined

---

## 💡 Tips & Best Practices

1. **Use LocalStorage** for user preferences
2. **Test on Mobile** devices
3. **Optimize Images** before deployment
4. **Use CSS Variables** for consistency
5. **Write Semantic HTML** for accessibility
6. **Comment Complex Code** for maintainability
7. **Follow Naming Conventions** for easy navigation
8. **Test Forms** thoroughly
9. **Monitor Performance** with DevTools
10. **Keep Dependencies Updated** for security

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute.

---

## 🤝 Contributing

Want to improve this project?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For questions or issues:
- Check existing documentation
- Review code comments
- Test in browser console
- Open an issue on GitHub

---

## 🎉 Acknowledgments

- **Design Inspiration**: Modern SaaS applications
- **Leaflet.js**: Excellent mapping library
- **Chart.js**: Powerful charting solution
- **OpenStreetMap**: Free map tiles

---

## ✨ Features Roadmap

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced AI analytics
- [ ] IoT sensor integration
- [ ] Social media sharing
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA)
- [ ] Offline functionality
- [ ] Voice commands

---

## 🎓 Learning Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [Chart.js Guide](https://www.chartjs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript Info](https://javascript.info/)

---

**Made with 💚 for cleaner cities**

Version 1.0.0 | Last Updated: March 2024
