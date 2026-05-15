// ===== ADMIN PAGE LOGIC =====

class AdminManager {
  constructor() {
    this.currentTab = 'overview';
    this.data = {};
    this.init();
  }

  init() {
    this.setupTabHandlers();
    this.loadOverview();
  }

  setupTabHandlers() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    // Load tab data
    switch (tabName) {
      case 'overview':
        this.loadOverview();
        break;
      case 'classifications':
        this.loadClassifications();
        break;
      case 'categories':
        this.loadCategories();
        break;
      case 'recommendations':
        this.loadRecommendations();
        break;
    }
  }

  async loadOverview() {
    try {
      Loader.show('Loading overview...');
      const stats = await API.getAdminStats();
      this.renderOverview(stats);
      Loader.hide();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to load overview');
      console.error('Overview error:', error);
    }
  }

  renderOverview(stats) {
    const overviewContent = document.querySelector('#overview-tab .overview-grid');
    if (!overviewContent) return;

    overviewContent.innerHTML = `
      <div class="overview-card">
        <div class="overview-label">Total Users</div>
        <div class="overview-value">${Formatters.formatNumber(stats.total_users || 0)}</div>
      </div>
      <div class="overview-card">
        <div class="overview-label">Total Classifications</div>
        <div class="overview-value">${Formatters.formatNumber(stats.total_classifications || 0)}</div>
      </div>
      <div class="overview-card">
        <div class="overview-label">Active Today</div>
        <div class="overview-value">${Formatters.formatNumber(stats.active_today || 0)}</div>
      </div>
      <div class="overview-card">
        <div class="overview-label">Avg Eco Score</div>
        <div class="overview-value">${(stats.avg_eco_score || 0).toFixed(1)}</div>
      </div>
    `;

    // Top items
    const topItemsTable = document.querySelector('#overview-tab .admin-data');
    if (topItemsTable) {
      const items = stats.top_items || [];
      topItemsTable.innerHTML = `
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Classifications</th>
            <th>Avg Score</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              item => `
            <tr>
              <td>${item.name}</td>
              <td><span class="badge badge-${item.category.toLowerCase()}">${item.category}</span></td>
              <td>${item.count}</td>
              <td>${item.avg_score.toFixed(1)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      `;
    }
  }

  async loadClassifications() {
    try {
      Loader.show('Loading classifications...');
      const data = await API.getClassifications({ limit: 50 });
      this.renderClassifications(data.items || []);
      Loader.hide();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to load classifications');
    }
  }

  renderClassifications(classifications) {
    const table = document.querySelector('#classifications-tab .admin-data');
    if (!table) return;

    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Item</th>
          <th>Category</th>
          <th>Confidence</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${classifications
          .map(
            c => `
          <tr>
            <td class="admin-data-id">${c.id.substring(0, 8)}...</td>
            <td class="admin-data-user">${c.user_name || 'Anonymous'}</td>
            <td class="admin-data-item">${c.item_name}</td>
            <td><span class="badge badge-${c.category.toLowerCase()}">${c.category}</span></td>
            <td class="admin-data-confidence">${Formatters.formatConfidence(c.confidence)}</td>
            <td>${Formatters.formatDate(c.created_at, 'short')}</td>
            <td class="admin-actions">
              <a href="/result.html?id=${c.id}" class="admin-action-btn admin-action-view">View</a>
              <button class="admin-action-btn admin-action-delete" onclick="deleteClassification('${c.id}')">Delete</button>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    `;
  }

  async loadCategories() {
    try {
      Loader.show('Loading categories...');
      const categories = await API.getCategories();
      this.renderCategories(categories);
      Loader.hide();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to load categories');
    }
  }

  renderCategories(categories) {
    const table = document.querySelector('#categories-tab .admin-data');
    if (!table) return;

    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Color</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${categories
          .map(
            cat => `
          <tr>
            <td>${cat.name}</td>
            <td>${cat.description.substring(0, 50)}...</td>
            <td><div style="width: 24px; height: 24px; background-color: ${cat.color}; border-radius: 4px;"></div></td>
            <td class="admin-actions">
              <button class="admin-action-btn admin-action-view" onclick="editCategory('${cat.id}')">Edit</button>
              <button class="admin-action-btn admin-action-delete" onclick="deleteCategory('${cat.id}')">Delete</button>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    `;
  }

  async loadRecommendations() {
    try {
      Loader.show('Loading recommendations...');
      const recommendations = await API.getRecommendations();
      this.renderRecommendations(recommendations);
      Loader.hide();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to load recommendations');
    }
  }

  renderRecommendations(recommendations) {
    const table = document.querySelector('#recommendations-tab .admin-data');
    if (!table) return;

    table.innerHTML = `
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${recommendations
          .map(
            rec => `
          <tr>
            <td>${rec.title}</td>
            <td><span class="badge badge-${rec.category.toLowerCase()}">${rec.category}</span></td>
            <td><span class="badge badge-${rec.priority.toLowerCase()}">${rec.priority}</span></td>
            <td class="admin-actions">
              <button class="admin-action-btn admin-action-view" onclick="editRecommendation('${rec.id}')">Edit</button>
              <button class="admin-action-btn admin-action-delete" onclick="deleteRecommendation('${rec.id}')">Delete</button>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    `;
  }
}

// Global functions for CRUD operations
async function deleteClassification(id) {
  if (confirm('Are you sure you want to delete this classification?')) {
    try {
      Loader.show('Deleting...');
      await API.deleteClassification(id);
      Loader.hide();
      toast.success('Deleted', 'Classification removed');
      // Reload
      const admin = new AdminManager();
      admin.loadClassifications();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to delete');
    }
  }
}

async function deleteCategory(id) {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      Loader.show('Deleting...');
      await API.deleteCategory(id);
      Loader.hide();
      toast.success('Deleted', 'Category removed');
      location.reload();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to delete');
    }
  }
}

async function deleteRecommendation(id) {
  if (confirm('Are you sure you want to delete this recommendation?')) {
    try {
      Loader.show('Deleting...');
      await API.deleteRecommendation(id);
      Loader.hide();
      toast.success('Deleted', 'Recommendation removed');
      location.reload();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to delete');
    }
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AdminManager();
  });
} else {
  new AdminManager();
}
