/* ========================================
   Smart Waste Management - Map Integration
   Leaflet.js Map Initialization & Markers
   ======================================== */

// Map storage
let wasteMap = null;
const mapMarkers = [];

/**
 * Initialize Map
 */
function initMap(mapElementId = 'map') {
  const mapElement = document.getElementById(mapElementId);
  if (!mapElement) return;

  // Remove existing map if any
  if (wasteMap) {
    wasteMap.remove();
    mapMarkers.length = 0;
  }

  // Initialize map centered on a city (Delhi coordinates)
  wasteMap = L.map(mapElementId).setView([28.5355, 77.3910], 13);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 10
  }).addTo(wasteMap);

  // Add waste bin markers
  addWasteBinMarkers();

  // Add waste report markers
  addWasteReportMarkers();

  console.log('Map initialized successfully ✓');
}

/**
 * Add Waste Bin Markers
 */
function addWasteBinMarkers() {
  if (!wasteMap) return;

  AppData.wasteBins.forEach(bin => {
    const statusColor = {
      'full': '#ef4444',
      'moderate': '#f59e0b',
      'empty': '#10b981'
    };

    const color = statusColor[bin.status] || '#10b981';

    // Create custom marker
    const binIcon = L.divIcon({
      className: 'bin-marker',
      html: `
        <div style="
          background: ${color};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 3px solid white;
        ">♻️</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    // Create marker
    const marker = L.marker([bin.lat, bin.lng], { icon: binIcon })
      .addTo(wasteMap)
      .bindPopup(`
        <div style="min-width:200px;">
          <h4 style="margin:0 0 8px 0;color:#10b981;font-weight:bold;">Waste Bin #${bin.id}</h4>
          <p style="margin:4px 0;"><strong>Location:</strong> ${bin.location}</p>
          <p style="margin:4px 0;"><strong>Area:</strong> ${bin.area}</p>
          <p style="margin:4px 0;"><strong>Status:</strong> <span style="color:${color};font-weight:bold;">${Format.capitalize(bin.status)}</span></p>
          <p style="margin:4px 0;"><strong>Capacity:</strong> ${bin.currentLevel}/${bin.capacity} kg</p>
          <p style="margin:4px 0;"><strong>Type:</strong> ${Format.capitalize(bin.wasteType)}</p>
          <p style="margin:8px 0 0 0;font-size:12px;color:#888;">Last collected: ${Format.date(bin.lastCollection)}</p>
        </div>
      `);

    mapMarkers.push(marker);
  });
}

/**
 * Add Waste Report Markers
 */
function addWasteReportMarkers() {
  if (!wasteMap) return;

  // Only add open and in-progress reports
  const activeReports = AppData.wasteReports.filter(r => r.status !== 'resolved');

  activeReports.forEach(report => {
    const severityColor = {
      'low': '#3b82f6',
      'medium': '#f59e0b',
      'high': '#ef4444',
      'critical': '#8b5cf6'
    };

    const color = severityColor[report.severity] || '#3b82f6';

    // Create custom marker for reports
    const reportIcon = L.divIcon({
      className: 'report-marker',
      html: `
        <div style="
          background: ${color};
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">⚠️</div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });

    const marker = L.marker([report.lat, report.lng], { icon: reportIcon })
      .addTo(wasteMap)
      .bindPopup(`
        <div style="min-width:200px;">
          <h4 style="margin:0 0 8px 0;color:${color};font-weight:bold;">Report #${report.id}</h4>
          <p style="margin:4px 0;"><strong>Location:</strong> ${report.location}</p>
          <p style="margin:4px 0;"><strong>Reported By:</strong> ${report.reportedBy}</p>
          <p style="margin:4px 0;"><strong>Issue:</strong> ${report.description}</p>
          <p style="margin:4px 0;"><strong>Severity:</strong> <span style="color:${color};font-weight:bold;">${Format.capitalize(report.severity)}</span></p>
          <p style="margin:4px 0;"><strong>Status:</strong> ${getStatusBadge(report.status)}</p>
          <p style="margin:8px 0 0 0;font-size:12px;color:#888;">Reported: ${Format.date(report.reportedDate)}</p>
        </div>
      `);

    mapMarkers.push(marker);
  });
}

/**
 * Add Heat Map Layer
 */
function addHeatMapLayer() {
  if (!wasteMap) return;

  // Create array of heat points based on waste report severity
  const heatPoints = AppData.wasteReports.map(report => {
    const severityValue = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.8,
      'critical': 1.0
    };
    return [report.lat, report.lng, severityValue[report.severity] || 0.5];
  });

  // Add heat layer if library is available
  if (typeof L.heatLayer !== 'undefined') {
    L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 13,
      min: 0,
      max: 1.0,
      gradient: {
        0.0: '#06b6d4',
        0.5: '#f59e0b',
        1.0: '#ef4444'
      }
    }).addTo(wasteMap);
  }
}

/**
 * Clear All Markers
 */
function clearMarkers() {
  mapMarkers.forEach(marker => {
    if (wasteMap) {
      wasteMap.removeLayer(marker);
    }
  });
  mapMarkers.length = 0;
}

/**
 * Refresh Markers
 */
function refreshMarkers() {
  clearMarkers();
  addWasteBinMarkers();
  addWasteReportMarkers();
}

/**
 * Fit Map Bounds to All Markers
 */
function fitMapBounds() {
  if (!wasteMap || mapMarkers.length === 0) return;

  const group = L.featureGroup(mapMarkers);
  wasteMap.fitBounds(group.getBounds().pad(0.1));
}

/**
 * Add Marker Cluster if library available
 */
function addMarkerClusters() {
  if (typeof L.MarkerClusterGroup === 'undefined') return;

  // Remove existing cluster group if any
  wasteMap.eachLayer(layer => {
    if (layer instanceof L.MarkerClusterGroup) {
      wasteMap.removeLayer(layer);
    }
  });

  const markerClusterGroup = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        html: `<div style="
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${cluster.getChildCount()}</div>`,
        className: 'marker-cluster',
        iconSize: [40, 40]
      });
    }
  });

  mapMarkers.forEach(marker => {
    markerClusterGroup.addLayer(marker);
  });

  wasteMap.addLayer(markerClusterGroup);
}

/**
 * Add Drawing Tools (if Leaflet Draw available)
 */
function addDrawingTools() {
  if (typeof L.Draw === 'undefined') return;

  const drawnItems = new L.FeatureGroup();
  wasteMap.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems
    }
  });
  wasteMap.addControl(drawControl);

  wasteMap.on('draw:created', function(e) {
    const layer = e.layer;
    drawnItems.addLayer(layer);
  });
}

/**
 * Get Map Center
 */
function getMapCenter() {
  if (!wasteMap) return null;
  const center = wasteMap.getCenter();
  return { lat: center.lat, lng: center.lng };
}

/**
 * Set Map Center
 */
function setMapCenter(lat, lng, zoom = 13) {
  if (!wasteMap) return;
  wasteMap.setView([lat, lng], zoom);
}

/**
 * Search Location
 */
function searchLocation(query) {
  // This would typically use a geocoding API
  // For now, returning mock results
  console.log('Searching for:', query);
  UI.toast('Location search feature coming soon!', 'info');
}

/**
 * Export for use
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMap,
    addWasteBinMarkers,
    addWasteReportMarkers,
    refreshMarkers,
    fitMapBounds,
    getMapCenter,
    setMapCenter,
    searchLocation
  };
}
