/* ========================================
   Smart Waste Management - Charts Configuration
   Chart.js Integration for Analytics
   ======================================== */

// Charts storage
const charts = {};

/**
 * Initialize Waste By Area Chart
 */
function initWasteByAreaChart() {
  const ctx = document.getElementById('wasteByAreaChart');
  if (!ctx) return;

  // Destroy existing chart if any
  if (charts.wasteByArea) {
    charts.wasteByArea.destroy();
  }

  charts.wasteByArea = new Chart(ctx, {
    type: 'doughnut',
    data: AppData.wasteChartData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12 },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = (context.parsed / total * 100).toFixed(1);
              return `${context.label}: ${Format.number(context.parsed)} kg (${percentage}%)`;
            }
          },
          padding: 12,
          titleFont: { size: 13 },
          bodyFont: { size: 12 }
        }
      }
    }
  });
}

/**
 * Initialize Complaint Trends Chart
 */
function initComplaintTrendsChart() {
  const ctx = document.getElementById('complaintTrendsChart');
  if (!ctx) return;

  // Destroy existing chart if any
  if (charts.complaintTrends) {
    charts.complaintTrends.destroy();
  }

  charts.complaintTrends = new Chart(ctx, {
    type: 'line',
    data: AppData.complaintChartData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: { size: 12 },
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.y} complaints`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5,
            font: { size: 11 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: { size: 11 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Initialize Collection Performance Chart
 */
function initCollectionPerformanceChart() {
  const ctx = document.getElementById('collectionPerformanceChart');
  if (!ctx) return;

  // Destroy existing chart if any
  if (charts.collectionPerformance) {
    charts.collectionPerformance.destroy();
  }

  charts.collectionPerformance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(AppData.collectionPerformance),
      datasets: [
        {
          label: 'Collections',
          data: Object.values(AppData.collectionPerformance),
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
          borderRadius: 8,
          hoverOffset: 4
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          padding: 12,
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: function(context) {
              return `${context.parsed.x}%`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            },
            font: { size: 11 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          ticks: {
            font: { size: 11 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Initialize Monthly Waste Collection Chart
 */
function initMonthlyWasteChart() {
  const ctx = document.getElementById('monthlyWasteChart');
  if (!ctx) return;

  if (charts.monthlyWaste) {
    charts.monthlyWaste.destroy();
  }

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Waste Collected (tons)',
        data: [450, 520, 680, 615, 740, 890],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  charts.monthlyWaste = new Chart(ctx, {
    type: 'line',
    data: monthlyData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: { size: 12 },
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} tons`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 11 },
            callback: function(value) {
              return value + ' tons';
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: { size: 11 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Initialize Bin Status Distribution Chart
 */
function initBinStatusChart() {
  const ctx = document.getElementById('binStatusChart');
  if (!ctx) return;

  if (charts.binStatus) {
    charts.binStatus.destroy();
  }

  const binCounts = {
    'Full': AppData.wasteBins.filter(b => b.status === 'full').length,
    'Moderate': AppData.wasteBins.filter(b => b.status === 'moderate').length,
    'Empty': AppData.wasteBins.filter(b => b.status === 'empty').length
  };

  charts.binStatus = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(binCounts),
      datasets: [
        {
          data: Object.values(binCounts),
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(16, 185, 129)'
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12 },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          padding: 12,
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = (context.parsed / total * 100).toFixed(1);
              return `${context.label}: ${context.parsed} bins (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize Collection by Area Chart
 */
function initCollectionByAreaChart() {
  const ctx = document.getElementById('collectionByAreaChart');
  if (!ctx) return;

  if (charts.collectionByArea) {
    charts.collectionByArea.destroy();
  }

  const areaData = {
    labels: Object.keys(AppData.wasteByArea),
    datasets: [
      {
        label: 'Waste Collected (kg)',
        data: Object.values(AppData.wasteByArea),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(6, 182, 212)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(249, 115, 22)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  charts.collectionByArea = new Chart(ctx, {
    type: 'bar',
    data: areaData,
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          padding: 12,
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: function(context) {
              return `${Format.number(context.parsed.x)} kg`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: { size: 11 },
            callback: function(value) {
              return Format.number(value);
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          ticks: {
            font: { size: 11 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Complaint Category Distribution Chart
 */
function initComplaintCategoryChart() {
  const ctx = document.getElementById('complaintCategoryChart');
  if (!ctx) return;

  if (charts.complaintCategory) {
    charts.complaintCategory.destroy();
  }

  const categoryCounts = {};
  AppData.wasteReports.forEach(report => {
    categoryCounts[report.category] = (categoryCounts[report.category] || 0) + 1;
  });

  charts.complaintCategory = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: Object.keys(categoryCounts).map(c => Format.capitalize(c.replace('_', ' '))),
      datasets: [
        {
          label: 'Complaints',
          data: Object.values(categoryCounts),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(249, 115, 22, 0.8)'
          ],
          borderColor: [
            'rgb(16, 185, 129)',
            'rgb(6, 182, 212)',
            'rgb(59, 130, 246)',
            'rgb(168, 85, 247)',
            'rgb(249, 115, 22)'
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: { size: 11 },
            padding: 10
          }
        },
        tooltip: {
          padding: 12,
          titleFont: { size: 13 },
          bodyFont: { size: 12 }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            font: { size: 10 }
          }
        }
      }
    }
  });
}

/**
 * Initialize All Charts
 */
function initAllCharts() {
  setTimeout(() => {
    initWasteByAreaChart();
    initComplaintTrendsChart();
    initCollectionPerformanceChart();
    initMonthlyWasteChart();
    initBinStatusChart();
    initCollectionByAreaChart();
    initComplaintCategoryChart();
  }, 100);
}

/**
 * Update Chart Data
 */
function updateChartData(chartName, newData) {
  if (!charts[chartName]) return;

  charts[chartName].data = newData;
  charts[chartName].update('active');
}

/**
 * Export for use
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initAllCharts,
    initWasteByAreaChart,
    initComplaintTrendsChart,
    initCollectionPerformanceChart,
    updateChartData
  };
}
