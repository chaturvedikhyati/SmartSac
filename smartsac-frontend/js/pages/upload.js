// ===== UPLOAD PAGE LOGIC =====

class UploadManager {
  constructor() {
    this.fileInput = null;
    this.uploadZone = null;
    this.textInput = null;
    this.selectedFile = null;
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
  }

  setupElements() {
    this.uploadZone = document.getElementById('upload-zone');
    this.fileInput = document.getElementById('file-input');
    this.textInput = document.getElementById('item-text-input');
    this.submitBtn = document.getElementById('submit-btn');
  }

  setupEventListeners() {
    if (!this.uploadZone) return;

    // Drag and drop
    this.uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadZone.classList.add('drag-over');
    });

    this.uploadZone.addEventListener('dragleave', () => {
      this.uploadZone.classList.remove('drag-over');
    });

    this.uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) this.handleFile(files[0]);
    });

    // Click to upload
    this.uploadZone.addEventListener('click', () => {
      this.fileInput?.click();
    });

    this.fileInput?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.handleFile(e.target.files[0]);
    });

    // Submit
    this.submitBtn?.addEventListener('click', () => this.handleSubmit());

    // Enter key on text input
    this.textInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    });
  }

  handleFile(file) {
    // Validate
    const validation = Validators.isValidImageFile(file);
    if (!validation.valid) {
      toast.error('Invalid File', validation.error);
      return;
    }

    this.selectedFile = file;
    this.showPreview(file);
  }

  showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewHTML = `
        <div class="upload-zone-preview">
          <img src="${e.target.result}" alt="Preview" class="upload-preview-image">
          <div class="upload-preview-info">
            <div class="upload-preview-name">${file.name}</div>
            <div class="upload-preview-size">${Formatters.formatFileSize(file.size)}</div>
          </div>
          <div class="upload-preview-actions">
            <button class="upload-remove" id="remove-file-btn">Remove</button>
          </div>
        </div>
      `;

      const emptyState = this.uploadZone.querySelector('.upload-zone-empty');
      if (emptyState) {
        emptyState.style.display = 'none';
      }

      let previewDiv = this.uploadZone.querySelector('.upload-zone-preview');
      if (previewDiv) {
        previewDiv.innerHTML = previewHTML;
      } else {
        const div = document.createElement('div');
        div.innerHTML = previewHTML;
        this.uploadZone.appendChild(div.firstElementChild);
      }

      document.getElementById('remove-file-btn')?.addEventListener('click', () => {
        this.clearFile();
      });
    };
    reader.readAsDataURL(file);
  }

  clearFile() {
    this.selectedFile = null;
    this.fileInput.value = '';

    const preview = this.uploadZone.querySelector('.upload-zone-preview');
    if (preview) preview.remove();

    const emptyState = this.uploadZone.querySelector('.upload-zone-empty');
    if (emptyState) emptyState.style.display = 'flex';
  }

  async handleSubmit() {
    const itemText = this.textInput?.value.trim() || '';

    // Validation
    if (!this.selectedFile && !itemText) {
      toast.error('Required', 'Please upload an image or enter an item name');
      return;
    }

    if (itemText && !Validators.isValidItemName(itemText)) {
      toast.error('Invalid Item Name', 'Item name must be between 3 and 200 characters');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    if (itemText) {
      formData.append('item', itemText);
    }

    // Submit
    try {
      Loader.show('Analyzing waste item...');
      this.submitBtn.disabled = true;

      const response = await API.classify(formData);

      Loader.hide();
      this.submitBtn.disabled = false;

      // Navigate to result
      window.location.href = `/result.html?id=${response.id}`;
    } catch (error) {
      Loader.hide();
      this.submitBtn.disabled = false;
      toast.error('Classification Failed', error.message || 'Please try again');
      console.error('Upload error:', error);
    }
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new UploadManager();
  });
} else {
  new UploadManager();
}
