// ===== DASHBOARD PAGE LOGIC =====

class DashboardManager {
  constructor() {
    this.dashboardData = null;
    this.init();
  }

  async init() {
    await this.loadData();
    this.render();
  }

  async loadData() {
    try {
      Loader.show('Loading dashboard...');
      this.dashboardData = await API.getDashboard();
      Loader.hide();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to load dashboard data');
      console.error('Dashboard error:', error);
    }
  }

  render() {
    this.renderStatCards();
    this.renderCharts();
    this.renderRecentActivity();
  }

  renderStatCards() {
    const cards = [
      {
        label: 'Total Classifications',
        value: this.dashboardData?.total_classifications || 0,
        trend: '+12%',
        icon: '📊',
      },
      {
        label: 'This Month',
        value: this.dashboardData?.classifications_this_month || 0,
        trend: '+5%',
        icon: '📅',
      },
      {
        label: 'Avg Eco Score',
        value: (this.dashboardData?.avg_eco_score || 0).toFixed(0),
        trend: '+3%',
        icon: '♻️',
      },
      {
        label: 'Recyclable %',
        value: (this.dashboardData?.recyclable_percentage || 0).toFixed(0) + '%',
        trend: '+8%',
        icon: '📈',
      },
    ];

    const statCardsContainer = document.querySelector('.stat-cards');
    if (statCardsContainer) {
      statCardsContainer.innerHTML = cards
        .map(
          card => `
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-card-label">${card.label}</div>
            <div class="stat-card-value">${Formatters.formatNumber(card.value)}</div>
            <div class="stat-card-trend">${card.trend}</div>
          </div>
          <div class="stat-card-icon">${card.icon}</div>
        </div>
      `
        )
        .join('');
    }
  }

  renderCharts() {
    // Category distribution donut chart
    this.renderCategoryChart();
    // Timeline bar chart
    this.renderTimelineChart();
  }

  renderCategoryChart() {
    const chartContainer = document.querySelector('#category-chart');
    if (!chartContainer) return;

    const categories = this.dashboardData?.category_distribution || [];
    const colors = ['#2d6a4f', '#52b788', '#e63946', '#457b9d', '#6c757d'];

    // Create pie chart SVG
    let svg = '<svg viewBox="0 0 200 200">';
    let currentAngle = 0;

    categories.forEach((cat, idx) => {
      const value = cat.count;
      const total = categories.reduce((sum, c) => sum + c.count, 0);
      const percentage = (value / total) * 100;
      const sliceAngle = (percentage / 100) * 360;

      // Draw slice
      const x1 = 100 + 90 * Math.cos((currentAngle * Math.PI) / 180);
      const y1 = 100 + 90 * Math.sin((currentAngle * Math.PI) / 180);
      const x2 = 100 + 90 * Math.cos(((currentAngle + sliceAngle) * Math.PI) / 180);
      const y2 = 100 + 90 * Math.sin(((currentAngle + sliceAngle) * Math.PI) / 180);

      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;

      svg += `<path d="${pathData}" fill="${colors[idx % colors.length]}" stroke="#fff" stroke-width="2"/>`;
      currentAngle += sliceAngle;
    });

    svg += '</svg>';
    chartContainer.innerHTML = svg;

    // Add legend
    const legend = document.querySelector('.chart-legend');
    if (legend) {
      legend.innerHTML = categories
        .map(
          (cat, idx) => `
        <div class="legend-item">
          <div class="legend-color" style="background-color: ${colors[idx % colors.length]}"></div>
          <span>${cat.category} (${cat.count})</span>
        </div>
      `
        )
        .join('');
    }
  }

  renderTimelineChart() {
    const chartContainer = document.querySelector('#timeline-chart');
    if (!chartContainer) return;

    const timeline = this.dashboardData?.timeline || [];
    const maxValue = Math.max(...timeline.map(t => t.count), 1);

    chartContainer.innerHTML = `
      <div class="bar-chart">
        ${timeline
          .map(
            (item, idx) => `
          <div class="bar-group">
            <div class="bar" style="height: ${(item.count / maxValue) * 100}%; background-color: #3d6b4f;"></div>
            <div class="bar-label">${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  renderRecentActivity() {
    const activities = this.dashboardData?.recent_activities || [];
    const tableBody = document.querySelector('tbody');

    if (!tableBody) return;

    if (activities.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 60px 20px;">
            <div class="empty-dashboard">
              <div class="empty-dashboard-icon">📭</div>
              <div class="empty-dashboard-title">No Classifications Yet</div>
              <div class="empty-dashboard-text">Start by uploading your first waste item for classification</div>
              <a href="/upload.html" class="btn btn-primary">Start Classifying</a>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = activities
      .map(
        activity => `
      <tr>
        <td class="activity-item-name">${activity.item_name}</td>
        <td><span class="activity-badge badge-${activity.category.toLowerCase()}">${activity.category}</span></td>
        <td class="activity-date">${Formatters.formatDate(activity.created_at, 'short')}</td>
        <td class="activity-score">${Math.round(activity.eco_score)}</td>
        <td>
          <a href="/result.html?id=${activity.id}" class="activity-action" title="View Result">👁️</a>
        </td>
      </tr>
    `
      )
      .join('');
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
  });
} else {
  new DashboardManager();
}
