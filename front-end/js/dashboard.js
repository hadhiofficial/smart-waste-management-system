/* ========================================
   Smart Waste Management - Dashboard Functions
   Dashboard Cards, Stats & Interactive Elements
   ======================================== */

/**
 * Dashboard Card Animation - Count up numbers
 */
function animateDashboardStats() {
  const statValues = document.querySelectorAll('.stat-value');
  
  statValues.forEach(stat => {
    const targetValue = parseInt(stat.textContent.replace(/,/g, ''));
    
    if (!isNaN(targetValue)) {
      // Animate only if it's a number
      let current = 0;
      const increment = Math.ceil(targetValue / 50);
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          stat.textContent = Format.number(targetValue);
          clearInterval(counter);
        } else {
          stat.textContent = Format.number(current);
        }
      }, 30);
    }
  });
}

/**
 * Status Badge Generator
 */
function getStatusBadge(status) {
  const statusClass = {
    'open': 'badge-danger',
    'in-progress': 'badge-warning',
    'resolved': 'badge-success',
    'pending': 'badge-warning',
    'completed': 'badge-success',
    'full': 'badge-danger',
    'moderate': 'badge-warning',
    'empty': 'badge-success',
    'active': 'badge-success',
    'inactive': 'badge-danger',
    'maintenance': 'badge-warning'
  };
  
  return `<span class="badge ${statusClass[status] || 'badge-info'}">${Format.capitalize(status.replace('_', ' '))}</span>`;
}

/**
 * Create Stat Card HTML
 */
function createStatCard(config) {
  return `
    <div class="stat-card animate-fade">
      <div class="stat-header">
        <div>
          <div class="stat-value">${config.value}</div>
          <div class="stat-label">${config.label}</div>
        </div>
        <div class="stat-icon">${config.icon}</div>
      </div>
      <div class="stat-change ${config.changeType || 'positive'}">
        <span>${config.change || '+5.2%'}</span>
        <span>vs last month</span>
      </div>
    </div>
  `;
}

/**
 * Create Complaint Card
 */
function createComplaintCard(complaint) {
  return `
    <tr>
      <td>#${complaint.id}</td>
      <td>${complaint.reportedBy}</td>
      <td>${complaint.location}</td>
      <td>${complaint.description}</td>
      <td>${getStatusBadge(complaint.status)}</td>
      <td>${Format.date(complaint.reportedDate)}</td>
      <td>
        <div class="flex gap-md">
          <button class="btn btn-sm btn-outline" onclick="viewComplaint(${complaint.id})">View</button>
          <button class="btn btn-sm btn-ghost" onclick="deleteComplaint(${complaint.id})">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Create Bin Table Row
 */
function createBinRow(bin) {
  const progressPercent = (bin.currentLevel / bin.capacity) * 100;
  const progressColor = progressPercent > 80 ? '#ef4444' : progressPercent > 50 ? '#f59e0b' : '#10b981';
  
  return `
    <tr>
      <td>#${bin.id}</td>
      <td>${bin.location}</td>
      <td>${bin.area}</td>
      <td>
        <div style="width:100px; height:8px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
          <div style="width:${progressPercent}%; height:100%; background:${progressColor};"></div>
        </div>
        <small>${bin.currentLevel}/${bin.capacity} kg</small>
      </td>
      <td>${getStatusBadge(bin.status)}</td>
      <td>${bin.wasteType}</td>
      <td>${Format.date(bin.lastCollection)}</td>
      <td>
        <div class="flex gap-md">
          <button class="btn btn-sm btn-outline" onclick="editBin(${bin.id})">Edit</button>
          <button class="btn btn-sm btn-ghost" onclick="deleteBin(${bin.id})">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Create Report Form Modal Content
 */
function getReportFormHTML() {
  return `
    <form id="reportForm" onsubmit="submitReport(event)">
      <div class="form-group">
        <label class="form-label form-required">Location</label>
        <input class="form-control" type="text" id="reportLocation" placeholder="Enter waste location" required>
      </div>

      <div class="form-group">
        <label class="form-label form-required">Description</label>
        <textarea class="form-textarea" id="reportDescription" placeholder="Describe the waste issue..." required></textarea>
      </div>

      <div class="form-group">
        <label class="form-label form-required">Category</label>
        <select class="form-select" id="reportCategory" required>
          <option value="">Select category</option>
          <option value="overflowing">Overflowing Bin</option>
          <option value="damaged_bin">Damaged Bin</option>
          <option value="illegal_dumping">Illegal Dumping</option>
          <option value="service_request">Service Request</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Severity</label>
        <div style="display:flex; gap:1rem;">
          <label class="form-check-label">
            <input class="form-radio" type="radio" name="severity" value="low"> Low
          </label>
          <label class="form-check-label">
            <input class="form-radio" type="radio" name="severity" value="medium" checked> Medium
          </label>
          <label class="form-check-label">
            <input class="form-radio" type="radio" name="severity" value="high"> High
          </label>
        </div>
      </div>

      <div style="display:flex; gap:1rem; margin-top:1.5rem;">
        <button type="submit" class="btn btn-primary" style="flex:1;">Submit Report</button>
        <button type="button" class="btn btn-ghost" style="flex:1;" onclick="Modal.close('reportModal')">Cancel</button>
      </div>
    </form>
  `;
}

/**
 * Create Bin Form Modal Content
 */
function getBinFormHTML(bin = null) {
  const isEdit = bin !== null;
  return `
    <form id="binForm" onsubmit="submitBinForm(event)">
      <input type="hidden" id="binId" value="${isEdit ? bin.id : ''}">

      <div class="form-group">
        <label class="form-label form-required">Location</label>
        <input class="form-control" type="text" id="binLocation" value="${isEdit ? bin.location : ''}" placeholder="Enter bin location" required>
      </div>

      <div class="form-group">
        <label class="form-label form-required">Area</label>
        <select class="form-select" id="binArea" required>
          <option value="">Select area</option>
          ${AppData.areas.map(area => `<option value="${area.name}" ${isEdit && bin.area === area.name ? 'selected' : ''}>${area.name}</option>`).join('')}
        </select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div class="form-group">
          <label class="form-label form-required">Latitude</label>
          <input class="form-control" type="number" id="binLat" step="0.0001" value="${isEdit ? bin.lat : ''}" placeholder="28.5355" required>
        </div>

        <div class="form-group">
          <label class="form-label form-required">Longitude</label>
          <input class="form-control" type="number" id="binLng" step="0.0001" value="${isEdit ? bin.lng : ''}" placeholder="77.3910" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label form-required">Waste Type</label>
        <select class="form-select" id="binWasteType" required>
          <option value="">Select type</option>
          <option value="mixed" ${isEdit && bin.wasteType === 'mixed' ? 'selected' : ''}>Mixed</option>
          <option value="organic" ${isEdit && bin.wasteType === 'organic' ? 'selected' : ''}>Organic</option>
          <option value="medical" ${isEdit && bin.wasteType === 'medical' ? 'selected' : ''}>Medical</option>
          <option value="commercial" ${isEdit && bin.wasteType === 'commercial' ? 'selected' : ''}>Commercial</option>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div class="form-group">
          <label class="form-label form-required">Capacity (kg)</label>
          <input class="form-control" type="number" id="binCapacity" value="${isEdit ? bin.capacity : '100'}" required>
        </div>

        <div class="form-group">
          <label class="form-label form-required">Current Level (kg)</label>
          <input class="form-control" type="number" id="binLevel" value="${isEdit ? bin.currentLevel : ''}" required>
        </div>
      </div>

      <div style="display:flex; gap:1rem; margin-top:1.5rem;">
        <button type="submit" class="btn btn-primary" style="flex:1;">${isEdit ? 'Update Bin' : 'Add Bin'}</button>
        <button type="button" class="btn btn-ghost" style="flex:1;" onclick="Modal.close('binModal')">Cancel</button>
      </div>
    </form>
  `;
}

/**
 * Populate Dashboard Stats
 */
function populateDashboardStats() {
  const statsContainer = document.getElementById('statsContainer');
  if (!statsContainer) return;

  const stats = [
    { value: AppData.adminStats.totalBins, label: 'Total Bins', icon: '♻️', change: '+12%', changeType: 'positive' },
    { value: AppData.adminStats.openComplaints, label: 'Open Complaints', icon: '⚠️', change: '-3%', changeType: 'positive' },
    { value: AppData.adminStats.pendingCollections, label: 'Pending Collections', icon: '🚛', change: '+5%', changeType: 'negative' },
    { value: AppData.adminStats.totalCollections, label: 'Total Collections', icon: '📊', change: '+18%', changeType: 'positive' }
  ];

  statsContainer.innerHTML = stats.map(stat => createStatCard(stat)).join('');
  
  // Animate stats after rendering
  setTimeout(animateDashboardStats, 100);
}

/**
 * Populate Complaints Table
 */
function populateComplaintsTable() {
  const tableBody = document.getElementById('complaintsTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = AppData.wasteReports.map(complaint => createComplaintCard(complaint)).join('');
}

/**
 * Populate Bins Table
 */
function populateBinsTable() {
  const tableBody = document.getElementById('binsTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = AppData.wasteBins.map(bin => createBinRow(bin)).join('');
}

/**
 * View Complaint Details
 */
function viewComplaint(complaintId) {
  const complaint = AppData.wasteReports.find(c => c.id === complaintId);
  if (!complaint) {
    UI.toast('Complaint not found', 'danger');
    return;
  }

  const content = `
    <div class="modal-body">
      <h4 class="card-title">Report #${complaint.id}</h4>
      <div style="margin-top:1.5rem;">
        <p><strong>Reported By:</strong> ${complaint.reportedBy}</p>
        <p><strong>Location:</strong> ${complaint.location}</p>
        <p><strong>Description:</strong> ${complaint.description}</p>
        <p><strong>Status:</strong> ${getStatusBadge(complaint.status)}</p>
        <p><strong>Severity:</strong> ${getStatusBadge(complaint.severity)}</p>
        <p><strong>Date:</strong> ${Format.date(complaint.reportedDate)}</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" onclick="resolveComplaint(${complaint.id})">Mark as Resolved</button>
      <button class="btn btn-ghost" onclick="Modal.close('viewComplaintModal')">Close</button>
    </div>
  `;

  const modal = document.getElementById('viewComplaintModal');
  if (modal) {
    modal.innerHTML = `
      <div class="modal-dialog" style="max-width:600px;">
        <div class="modal-header">
          <h3 class="modal-title">Complaint Details</h3>
          <button class="modal-close" onclick="Modal.close('viewComplaintModal')">&times;</button>
        </div>
        ${content}
      </div>
    `;
    Modal.open('viewComplaintModal');
  }
}

/**
 * Submit Report
 */
function submitReport(event) {
  event.preventDefault();

  const location = document.getElementById('reportLocation').value;
  const description = document.getElementById('reportDescription').value;
  const category = document.getElementById('reportCategory').value;
  const severity = document.querySelector('input[name="severity"]:checked').value;

  if (!location || !description || !category) {
    UI.toast('Please fill all required fields', 'warning');
    return;
  }

  // Create new report
  const newReport = {
    id: Math.max(...AppData.wasteReports.map(r => r.id)) + 1,
    userId: AppData.currentUser.id,
    reportedBy: AppData.currentUser.name,
    location: location,
    lat: 28.5355,
    lng: 77.3910,
    description: description,
    severity: severity,
    status: 'open',
    category: category,
    reportedDate: new Date().toISOString().split('T')[0]
  };

  AppData.wasteReports.push(newReport);
  
  UI.toast('Report submitted successfully!', 'success');
  Modal.close('reportModal');
  
  // Reset form
  document.getElementById('reportForm').reset();
  
  // Refresh table if visible
  if (document.getElementById('complaintsTableBody')) {
    populateComplaintsTable();
  }
}

/**
 * Submit Bin Form
 */
function submitBinForm(event) {
  event.preventDefault();

  const binId = document.getElementById('binId').value;
  const location = document.getElementById('binLocation').value;
  const area = document.getElementById('binArea').value;
  const lat = parseFloat(document.getElementById('binLat').value);
  const lng = parseFloat(document.getElementById('binLng').value);
  const wasteType = document.getElementById('binWasteType').value;
  const capacity = parseInt(document.getElementById('binCapacity').value);
  const level = parseInt(document.getElementById('binLevel').value);

  if (!location || !area || !lat || !lng || !wasteType) {
    UI.toast('Please fill all required fields', 'warning');
    return;
  }

  if (binId) {
    // Edit existing bin
    const bin = AppData.wasteBins.find(b => b.id === parseInt(binId));
    if (bin) {
      bin.location = location;
      bin.area = area;
      bin.lat = lat;
      bin.lng = lng;
      bin.wasteType = wasteType;
      bin.capacity = capacity;
      bin.currentLevel = level;
      UI.toast('Bin updated successfully!', 'success');
    }
  } else {
    // Add new bin
    const newBin = {
      id: Math.max(...AppData.wasteBins.map(b => b.id)) + 1,
      location: location,
      area: area,
      lat: lat,
      lng: lng,
      status: level > capacity * 0.8 ? 'full' : level > capacity * 0.5 ? 'moderate' : 'empty',
      wasteType: wasteType,
      capacity: capacity,
      currentLevel: level,
      lastCollection: new Date().toISOString().split('T')[0],
      nextCollection: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      condition: 'good'
    };
    AppData.wasteBins.push(newBin);
    UI.toast('Bin added successfully!', 'success');
  }

  Modal.close('binModal');
  document.getElementById('binForm').reset();

  if (document.getElementById('binsTableBody')) {
    populateBinsTable();
  }
}

/**
 * Edit Bin
 */
function editBin(binId) {
  const bin = AppData.wasteBins.find(b => b.id === binId);
  if (!bin) return;

  const modal = document.getElementById('binModal');
  if (modal) {
    modal.querySelector('.modal-dialog').innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Edit Bin #${bin.id}</h3>
        <button class="modal-close" onclick="Modal.close('binModal')">&times;</button>
      </div>
      <div class="modal-body">
        ${getBinFormHTML(bin)}
      </div>
    `;
    Modal.open('binModal');
  }
}

/**
 * Delete Bin
 */
function deleteBin(binId) {
  if (!UI.confirm('Are you sure you want to delete this bin?')) return;

  const index = AppData.wasteBins.findIndex(b => b.id === binId);
  if (index > -1) {
    AppData.wasteBins.splice(index, 1);
    UI.toast('Bin deleted successfully!', 'success');

    if (document.getElementById('binsTableBody')) {
      populateBinsTable();
    }
  }
}

/**
 * Delete Complaint
 */
function deleteComplaint(complaintId) {
  if (!UI.confirm('Are you sure you want to delete this complaint?')) return;

  const index = AppData.wasteReports.findIndex(c => c.id === complaintId);
  if (index > -1) {
    AppData.wasteReports.splice(index, 1);
    UI.toast('Complaint deleted successfully!', 'success');

    if (document.getElementById('complaintsTableBody')) {
      populateComplaintsTable();
    }
  }
}

/**
 * Resolve Complaint
 */
function resolveComplaint(complaintId) {
  const complaint = AppData.wasteReports.find(c => c.id === complaintId);
  if (complaint) {
    complaint.status = 'resolved';
    complaint.resolvedDate = new Date().toISOString().split('T')[0];
    UI.toast('Complaint marked as resolved!', 'success');
    Modal.close('viewComplaintModal');

    if (document.getElementById('complaintsTableBody')) {
      populateComplaintsTable();
    }
  }
}

/**
 * Open Report Modal
 */
function openReportModal() {
  const modal = document.getElementById('reportModal');
  if (modal) {
    modal.querySelector('.modal-dialog').innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Report Waste</h3>
        <button class="modal-close" onclick="Modal.close('reportModal')">&times;</button>
      </div>
      <div class="modal-body">
        ${getReportFormHTML()}
      </div>
    `;
    Modal.open('reportModal');
  }
}

/**
 * Open Bin Modal
 */
function openBinModal() {
  const modal = document.getElementById('binModal');
  if (modal) {
    modal.querySelector('.modal-dialog').innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Add New Bin</h3>
        <button class="modal-close" onclick="Modal.close('binModal')">&times;</button>
      </div>
      <div class="modal-body">
        ${getBinFormHTML()}
      </div>
    `;
    Modal.open('binModal');
  }
}

/**
 * Filter Table by Search
 */
function filterTable(searchId, tableBodyId) {
  const searchInput = document.getElementById(searchId);
  const tableBody = document.getElementById(tableBodyId);

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

/**
 * Export for use
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    animateDashboardStats,
    populateDashboardStats,
    populateComplaintsTable,
    populateBinsTable,
    openReportModal,
    openBinModal,
    filterTable
  };
}
