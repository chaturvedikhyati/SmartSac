// ===== RESULT PAGE LOGIC =====

class ResultManager {
  constructor() {
    this.resultId = null;
    this.resultData = null;
    this.init();
  }

  async init() {
    // Get result ID from URL
    const params = new URLSearchParams(window.location.search);
    this.resultId = params.get('id');

    if (!this.resultId) {
      window.location.href = '/upload.html';
      return;
    }

    await this.loadResult();
    this.setupEventListeners();
  }

  async loadResult() {
    try {
      Loader.show('Loading result...');
      this.resultData = await API.getResult(this.resultId);
      Loader.hide();
      this.render();
    } catch (error) {
      Loader.hide();
      toast.error('Error', 'Failed to load result');
      console.error('Load result error:', error);
      setTimeout(() => {
        window.location.href = '/upload.html';
      }, 2000);
    }
  }

  render() {
    // Populate image
    const imageEl = document.querySelector('.result-image');
    if (this.resultData.image_url) {
      imageEl.innerHTML = `<img src="${this.resultData.image_url}" alt="Classified item">`;
    }

    // Item name
    const itemNameEl = document.querySelector('.result-item-name');
    if (itemNameEl) {
      itemNameEl.textContent = Formatters.formatItemName(this.resultData.item_name);
    }

    // Category badge and info
    const category = this.resultData.category.toLowerCase();
    const categoryBadge = document.querySelector('.result-category-badge');
    if (categoryBadge) {
      const icons = {
        recyclable: '♻️',
        compostable: '🌿',
        hazardous: '☠️',
        reusable: '🔄',
        landfill: '⛰️',
      };
      categoryBadge.textContent = icons[category] || '📦';
      categoryBadge.style.backgroundColor = this.getCategoryColor(category);
    }

    const categoryName = document.querySelector('.result-category-info h2');
    if (categoryName) {
      categoryName.textContent = this.resultData.category;
    }

    // Confidence
    const confidenceValue = document.querySelector('.result-confidence-value');
    if (confidenceValue) {
      confidenceValue.textContent = Formatters.formatConfidence(this.resultData.confidence);
    }

    const confidenceFill = document.querySelector('.result-confidence-fill');
    if (confidenceFill) {
      const percent = (this.resultData.confidence * 100).toFixed(0);
      confidenceFill.style.width = percent + '%';
    }

    // Eco Score
    this.renderEcoScore();

    // Instructions
    this.renderInstructions();
  }

  renderEcoScore() {
    const ecoNumber = document.querySelector('.result-eco-number');
    if (ecoNumber) {
      ecoNumber.textContent = Math.round(this.resultData.eco_score);
    }

    const ecoCircle = document.querySelector('.result-eco-circle svg');
    if (ecoCircle) {
      this.drawCircleProgress(ecoCircle, this.resultData.eco_score);
    }

    const meaningText = document.querySelector('.result-eco-meaning-text');
    if (meaningText) {
      const score = this.resultData.eco_score;
      if (score >= 70) {
        meaningText.textContent = 'Excellent! This disposal method significantly reduces environmental impact.';
      } else if (score >= 40) {
        meaningText.textContent = 'Good effort! This method has moderate environmental impact. Consider alternatives.';
      } else {
        meaningText.textContent = 'Try to find better alternatives. This method has higher environmental impact.';
      }
    }
  }

  drawCircleProgress(svg, value) {
    // Create SVG circle with progress
    const percentage = value;
    const circumference = 282.7;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const color = Formatters.formatEcoScoreColor(value);
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    };

    svg.innerHTML = `
      <circle 
        class="circular-progress-circle" 
        cx="60" 
        cy="60" 
        r="45"
        fill="none"
        stroke="${colors[color]}"
        stroke-dasharray="282.7"
        stroke-dashoffset="${strokeDashoffset}"
        style="transition: stroke-dashoffset 0.8s ease-out;"
      />
    `;
  }

  renderInstructions() {
    const tabsContainer = document.querySelector('.result-tabs');
    if (!tabsContainer) return;

    const tabs = [
      { label: 'How to Dispose', content: this.resultData.disposal_instructions },
      { label: 'Why This Category', content: this.resultData.category_explanation },
      { label: 'Eco Tips', content: this.resultData.eco_tips },
    ];

    // Create tab buttons
    tabsContainer.innerHTML = '';
    tabs.forEach((tab, index) => {
      const btn = document.createElement('button');
      btn.className = `result-tab ${index === 0 ? 'active' : ''}`;
      btn.textContent = tab.label;
      btn.addEventListener('click', () => this.switchTab(index, tabs));
      tabsContainer.appendChild(btn);
    });

    // Create tab content
    const contentContainer = document.querySelector('.result-instructions');
    const existingContent = contentContainer.querySelector('.result-instructions-items');
    if (existingContent) existingContent.remove();

    const contentDiv = document.createElement('div');
    contentDiv.className = 'result-instructions-items';

    tabs.forEach((tab, index) => {
      const tabContent = document.createElement('div');
      tabContent.className = `result-tab-content ${index === 0 ? 'active' : ''}`;
      tabContent.innerHTML = this.formatInstructions(tab.content);
      contentDiv.appendChild(tabContent);
    });

    contentContainer.appendChild(contentDiv);
  }

  formatInstructions(text) {
    if (!text) return '<p>No information available.</p>';

    // Simple formatting - convert line breaks to paragraphs
    return text
      .split('\n')
      .filter(line => line.trim())
      .map((line, idx) => {
        if (line.startsWith('•') || line.startsWith('-')) {
          return `<li class="result-instructions-item"><div class="result-instructions-step">${idx + 1}</div><div>${line.substring(1).trim()}</div></li>`;
        }
        return `<p class="result-instructions-text">${line}</p>`;
      })
      .join('');
  }

  switchTab(index, tabs) {
    // Update buttons
    document.querySelectorAll('.result-tab').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Update content
    document.querySelectorAll('.result-tab-content').forEach((content, i) => {
      content.classList.toggle('active', i === index);
    });
  }

  getCategoryColor(category) {
    const colors = {
      recyclable: '#2d6a4f',
      compostable: '#52b788',
      hazardous: '#e63946',
      reusable: '#457b9d',
      landfill: '#6c757d',
    };
    return colors[category] || '#3d6b4f';
  }

  setupEventListeners() {
    // Classify another
    document.getElementById('btn-classify-another')?.addEventListener('click', () => {
      window.location.href = '/upload.html';
    });

    // View history
    document.getElementById('btn-view-history')?.addEventListener('click', () => {
      window.location.href = '/history.html';
    });

    // Share result
    document.getElementById('btn-share-result')?.addEventListener('click', () => {
      this.shareResult();
    });
  }

  async shareResult() {
    const shareData = {
      title: 'SmartSac Classification Result',
      text: `I classified "${this.resultData.item_name}" as ${this.resultData.category} with ${Formatters.formatConfidence(this.resultData.confidence)} confidence!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const text = `${shareData.text} ${shareData.url}`;
        await navigator.clipboard.writeText(text);
        toast.success('Copied', 'Result link copied to clipboard!');
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ResultManager();
  });
} else {
  new ResultManager();
}
