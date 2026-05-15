// ===== HISTORY PAGE LOGIC =====

class HistoryManager {
  constructor() {
    this.histories = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.filters = {
      search: '',
      category: '',
      dateFrom: '',
      dateTo: '',
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadHistories();
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      this.currentPage = 1;
      this.loadHistories();
    });

    // Category filter
    const categorySelect = document.getElementById('category-filter');
    categorySelect?.addEventListener('change', (e) => {
      this.filters.category = e.target.value;
      this.currentPage = 1;
      this.loadHistories();
    });

    // Date range
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    dateFromInput?.addEventListener('change', (e) => {
      this.filters.dateFrom = e.target.value;
      this.currentPage = 1;
      this.loadHistories();
    });
    dateToInput?.addEventListener('change', (e) => {
      this.filters.dateTo = e.target.value;
      this.currentPage = 1;
      this.loadHistories();
    });

    // Clear filters
    const clearBtn = document.getElementById('clear-filters-btn');
    clearBtn?.addEventListener('click', () => {
      this.filters = { search: '', category: '', dateFrom: '', dateTo: '' };
      this.currentPage = 1;
      searchInput.value = '';
      categorySelect.value = '';
      dateFromInput.value = '';
      dateToInput.value = '';
      this.loadHistories();
    });

    // Pagination
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    prevBtn?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      }
    });
    nextBtn?.addEventListener('click', () => {
      if (this.hasNextPage()) {
        this.currentPage++;
        this.render();
      }
    });
  }

  async loadHistories() {
    try {
      Loader.show('Loading history...');
      const params = {
        ...this.filters,
        page: this.currentPage,
        limit: this.itemsPerPage,
      };
      const response = await API.getHistory(params);
      this.histories = response.items || [];
      Loader.hide();
      this.render();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to load history');
      console.error('History error:', error);
    }
  }

  render() {
    this.renderHistoryCards();
    this.renderPagination();
  }

  renderHistoryCards() {
    const grid = document.querySelector('.history-grid');
    if (!grid) return;

    if (this.histories.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1;">
          <div class="empty-history">
            <div class="empty-history-icon">📭</div>
            <div class="empty-history-title">No Classifications Found</div>
            <div class="empty-history-text">Try adjusting your filters or start by classifying a waste item</div>
            <a href="/upload.html" class="btn btn-primary">Classify Now</a>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.histories
      .map(
        history => `
      <div class="history-card">
        <div class="history-card-image">
          ${history.image_url ? `<img src="${history.image_url}" alt="${history.item_name}">` : '📦'}
        </div>
        <div class="history-card-content">
          <div class="history-card-name">${Formatters.formatItemName(history.item_name)}</div>
          <span class="history-card-category badge-${history.category.toLowerCase()}">${history.category}</span>
          <div class="history-card-meta">
            <span class="history-card-date">${Formatters.formatDate(history.created_at, 'short')}</span>
            <span class="history-card-score">${Math.round(history.eco_score)}</span>
          </div>
          <a href="/result.html?id=${history.id}" class="history-card-action">View Details</a>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderPagination() {
    const totalPages = Math.ceil((this.histories.length > 0 ? 100 : 0) / this.itemsPerPage); // Simplified
    const infoEl = document.querySelector('.pagination-info');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    if (infoEl) {
      infoEl.textContent = `Page ${this.currentPage}`;
    }

    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }

    if (nextBtn) {
      nextBtn.disabled = !this.hasNextPage();
    }
  }

  hasNextPage() {
    return this.histories.length === this.itemsPerPage;
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HistoryManager();
  });
} else {
  new HistoryManager();
}
