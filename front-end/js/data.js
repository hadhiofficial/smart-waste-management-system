/* ========================================
   Smart Waste Management - Sample Data
   Mock Data for Development & Testing
   ======================================== */

// User Authentication Data
const currentUser = {
  id: 1,
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  role: 'citizen', // citizen, admin, driver
  avatar: 'RK',
  phone: '+91-9876543210',
  address: '123 Main Street, Delhi',
  joinDate: '2023-01-15'
};

// Waste Bins Data
const wasteBins = [
  {
    id: 1,
    location: 'Main Market, Sector 5',
    lat: 28.5355,
    lng: 77.3910,
    status: 'full', // full, moderate, empty
    wasteType: 'mixed',
    capacity: 100,
    currentLevel: 85,
    lastCollection: '2024-03-14',
    nextCollection: '2024-03-16',
    area: 'Downtown',
    condition: 'good'
  },
  {
    id: 2,
    location: 'Park Avenue, Sector 8',
    lat: 28.5390,
    lng: 77.3950,
    status: 'moderate',
    wasteType: 'organic',
    capacity: 100,
    currentLevel: 65,
    lastCollection: '2024-03-15',
    nextCollection: '2024-03-17',
    area: 'North Zone',
    condition: 'good'
  },
  {
    id: 3,
    location: 'School Road, Sector 3',
    lat: 28.5320,
    lng: 77.3870,
    status: 'empty',
    wasteType: 'mixed',
    capacity: 100,
    currentLevel: 20,
    lastCollection: '2024-03-13',
    nextCollection: '2024-03-18',
    area: 'East Zone',
    condition: 'fair'
  },
  {
    id: 4,
    location: 'Hospital Complex, Sector 10',
    lat: 28.5420,
    lng: 77.3980,
    status: 'full',
    wasteType: 'medical',
    capacity: 80,
    currentLevel: 75,
    lastCollection: '2024-03-12',
    nextCollection: '2024-03-15',
    area: 'Central Zone',
    condition: 'good'
  },
  {
    id: 5,
    location: 'Shopping Mall, Sector 15',
    lat: 28.5300,
    lng: 77.3920,
    status: 'moderate',
    wasteType: 'commercial',
    capacity: 150,
    currentLevel: 90,
    lastCollection: '2024-03-14',
    nextCollection: '2024-03-16',
    area: 'West Zone',
    condition: 'excellent'
  }
];

// Waste Reports
const wasteReports = [
  {
    id: 101,
    userId: 1,
    reportedBy: 'Rajesh Kumar',
    location: 'Main Market Junction',
    lat: 28.5355,
    lng: 77.3910,
    description: 'Overflowing garbage bin, waste on ground',
    severity: 'high',
    status: 'open', // open, in-progress, resolved
    category: 'overflowing',
    image: null,
    reportedDate: '2024-03-15',
    photo: null,
    priority: 'high'
  },
  {
    id: 102,
    userId: 2,
    reportedBy: 'Priya Singh',
    location: 'Park Road Area',
    lat: 28.5390,
    lng: 77.3950,
    description: 'Illegal dumping creating health hazard',
    severity: 'critical',
    status: 'in-progress',
    category: 'illegal_dumping',
    image: null,
    reportedDate: '2024-03-14',
    photo: null,
    priority: 'critical'
  },
  {
    id: 103,
    userId: 3,
    reportedBy: 'Amit Patel',
    location: 'School Road',
    lat: 28.5320,
    lng: 77.3870,
    description: 'Broken bin, needs replacement',
    severity: 'medium',
    status: 'resolved',
    category: 'damaged_bin',
    image: null,
    reportedDate: '2024-03-13',
    resolvedDate: '2024-03-14',
    photo: null,
    priority: 'medium'
  },
  {
    id: 104,
    userId: 4,
    reportedBy: 'Neha Sharma',
    location: 'Shopping Mall',
    lat: 28.5300,
    lng: 77.3920,
    description: 'Missing collection service',
    severity: 'low',
    status: 'open',
    category: 'service_request',
    image: null,
    reportedDate: '2024-03-15',
    photo: null,
    priority: 'low'
  }
];

// Driver Collection Tasks
const driverTasks = [
  {
    id: 1001,
    driverId: 5,
    binIds: [1, 2, 3],
    date: '2024-03-16',
    status: 'pending', // pending, in-progress, completed
    route: 'Route A - Downtown',
    estimatedTime: '2 hours',
    vehicle: 'Truck-001',
    assignedAt: '2024-03-15T08:00:00'
  },
  {
    id: 1002,
    driverId: 6,
    binIds: [4, 5],
    date: '2024-03-16',
    status: 'in-progress',
    route: 'Route B - Suburbs',
    estimatedTime: '1.5 hours',
    vehicle: 'Truck-002',
    assignedAt: '2024-03-15T09:00:00'
  }
];

// Admin Statistics
const adminStats = {
  totalBins: 145,
  activeBins: 135,
  maintenanceBins: 10,
  totalComplaints: 324,
  openComplaints: 28,
  pendingCollections: 12,
  totalCollections: 1250,
  wasteCollected: '2450 tons',
  avgResponseTime: '2.4 hours',
  satisfactionRating: 4.7,
  activeDrivers: 15,
  completedToday: 18,
  pendingToday: 5
};

// Analytics Data - Waste Collected Per Area
const wasteByArea = {
  'Downtown': 450,
  'North Zone': 380,
  'East Zone': 320,
  'Central Zone': 410,
  'West Zone': 390,
  'South Zone': 500
};

// Analytics Data - Complaint Trends (Last 7 days)
const complaintTrends = {
  '2024-03-09': 18,
  '2024-03-10': 22,
  '2024-03-11': 25,
  '2024-03-12': 20,
  '2024-03-13': 28,
  '2024-03-14': 32,
  '2024-03-15': 24
};

// Analytics Data - Collection Performance
const collectionPerformance = {
  'On Time': 92,
  'Delayed': 6,
  'Pending': 2
};

// Chart.js Data - Waste Collected Per Area
const wasteChartData = {
  labels: Object.keys(wasteByArea),
  datasets: [
    {
      label: 'Waste Collected (kg)',
      data: Object.values(wasteByArea),
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(6, 182, 212)',
        'rgb(59, 130, 246)',
        'rgb(168, 85, 247)',
        'rgb(249, 115, 22)',
        'rgb(59, 130, 246)'
      ],
      borderWidth: 2,
      borderRadius: 8,
      hoverOffset: 4
    }
  ]
};

// Chart.js Data - Complaint Trends
const complaintChartData = {
  labels: Object.keys(complaintTrends),
  datasets: [
    {
      label: 'Daily Complaints',
      data: Object.values(complaintTrends),
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(16, 185, 129)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }
  ]
};

// Chart.js Data - Collection Performance
const performanceChartData = {
  labels: Object.keys(collectionPerformance),
  datasets: [
    {
      label: 'Collections',
      data: Object.values(collectionPerformance),
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 2,
      borderRadius: 6,
      hoverOffset: 4
    }
  ]
};

// Users List (for admin)
const usersList = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'citizen', status: 'active', joinDate: '2023-01-15' },
  { id: 2, name: 'Priya Singh', email: 'priya@example.com', role: 'citizen', status: 'active', joinDate: '2023-02-20' },
  { id: 3, name: 'Amit Patel', email: 'amit@example.com', role: 'driver', status: 'active', joinDate: '2023-03-10' },
  { id: 4, name: 'Neha Sharma', email: 'neha@example.com', role: 'admin', status: 'active', joinDate: '2023-01-05' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', role: 'driver', status: 'active', joinDate: '2023-04-01' }
];

// Areas Configuration
const areas = [
  { id: 1, name: 'Downtown', zones: 5, binCount: 25, managerId: 1 },
  { id: 2, name: 'North Zone', zones: 4, binCount: 22, managerId: 2 },
  { id: 3, name: 'East Zone', zones: 3, binCount: 18, managerId: 3 },
  { id: 4, name: 'Central Zone', zones: 6, binCount: 28, managerId: 1 },
  { id: 5, name: 'West Zone', zones: 4, binCount: 20, managerId: 4 },
  { id: 6, name: 'South Zone', zones: 5, binCount: 32, managerId: 2 }
];

// Vehicles
const vehicles = [
  { id: 'V001', type: 'Truck', capacity: '5 tons', status: 'active', driver: 'Amit Patel', lastService: '2024-02-15' },
  { id: 'V002', type: 'Van', capacity: '2 tons', status: 'active', driver: 'Vikram Singh', lastService: '2024-03-01' },
  { id: 'V003', type: 'Truck', capacity: '5 tons', status: 'maintenance', driver: null, lastService: '2024-01-20' },
  { id: 'V004', type: 'Van', capacity: '2 tons', status: 'active', driver: 'Suresh Kumar', lastService: '2024-03-08' }
];

// Export all data
const AppData = {
  currentUser,
  wasteBins,
  wasteReports,
  driverTasks,
  adminStats,
  wasteByArea,
  complaintTrends,
  collectionPerformance,
  wasteChartData,
  complaintChartData,
  performanceChartData,
  usersList,
  areas,
  vehicles
};

// For use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppData;
}
