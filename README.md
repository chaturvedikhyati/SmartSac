<div align="center">

  <!-- Badges & Links -->
  <a href="https://github.com/chaturvedikhyati">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
  <a href="https://www.linkedin.com/in/khyati-chaturvedi/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>

</div>

<h1 align="center">♻️ SmartSac - Smart Waste Sorting Assistant</h1>

<h3 align="center">AI-Powered Waste Classification • Eco-Friendly Disposal • Gamified Sustainability</h3>

---

## 📊 Project Overview

**SmartSac** is a production-grade, premium web application for intelligent waste classification and eco-friendly disposal guidance. It uses AI to classify waste types and provides actionable recommendations for sustainable disposal. Built with vanilla HTML, CSS, and JavaScript — zero framework dependencies.

### ✨ Key Features

- 🤖 **AI-Powered Classification** — Upload images or type item names for instant waste categorization
- 🎨 **Beautiful UI** — Premium design with smooth animations and dark mode support
- 📱 **Responsive Design** — Perfect experience on desktop, tablet, and mobile
- ⚡ **Real-Time Feedback** — Dynamic loading states and instant notifications
- 🏆 **Admin Dashboard** — Full CRUD operations for waste categories
- 🎮 **Eco Scoring** — Gamified sustainability tracking system
- 💻 **Zero Dependencies** — Pure vanilla JavaScript, no frameworks

---

## 🛠️ Tech Stack

### Frontend
<code><img height="25" src="https://img.shields.io/badge/HTML-E34C26?style=for-the-badge&logo=html5&logoColor=white"/></code>
<code><img height="25" src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white"/></code>
<code><img height="25" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/></code>

### Design System
- CSS Variables for theming
- Responsive Grid System
- Smooth Animations
- Dark Mode Support

### Tools
<code><img height="25" src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/></code>
<code><img height="25" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/></code>
<code><img height="25" src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white"/></code>

---

## 📂 Project Structure

```
SmartSac/
├── index.html              # Landing page
├── dashboard.html          # User dashboard
├── upload.html             # Upload/classify page
├── history.html            # Waste history page
├── result.html             # Classification result page
├── admin.html              # Admin panel
│
├── css/
│   ├── base.css            # CSS variables, reset, typography
│   ├── components.css      # Buttons, cards, badges, modals
│   ├── layout.css          # Navbar, sidebar, footer
│   ├── landing.css         # Landing page styles
│   ├── dashboard.css       # Dashboard styles
│   ├── upload.css          # Upload page styles
│   ├── history.css         # History page styles
│   ├── result.css          # Result page styles
│   └── admin.css           # Admin panel styles
│
├── js/
│   ├── core/
│   │   ├── api.js          # Centralized API client
│   │   ├── auth.js         # Authentication management
│   │   ├── router.js       # Client-side routing
│   │   └── theme.js        # Dark mode toggle
│   │
│   ├── components/
│   │   ├── navbar.js       # Dynamic navbar
│   │   ├── toast.js        # Toast notifications
│   │   ├── modal.js        # Modal dialogs
│   │   └── loader.js       # Loading overlay
│   │
│   ├── pages/
│   │   ├── landing.js      # Landing page logic
│   │   ├── upload.js       # Upload page logic
│   │   ├── result.js       # Result page logic
│   │   ├── dashboard.js    # Dashboard logic
│   │   ├── history.js      # History page logic
│   │   └── admin.js        # Admin panel logic
│   │
│   └── utils/
│       ├── formatters.js   # Date, number, category formatting
│       └── validators.js   # Input validation helpers
│
└── assets/
    ├── icons/              # SVG icons
    └── images/             # Hero illustrations
```

---

## 🎨 Design System

### Colors
- **Primary Background:** `#f9f8f6` (warm off-white)
- **Accent:** `#3d6b4f` (forest green)
- **Dark Mode BG:** `#141412`
- **Success:** `#10b981`
- **Error:** `#ef4444`
- **Warning:** `#f59e0b`

### Typography
- **Headings:** Instrument Serif / Playfair Display
- **Body:** Inter (Google Fonts)
- **Spacing:** 8px base grid system
- **Border Radius:** 12px cards, 8px inputs, 999px pills

### Responsive Breakpoints
- 480px — Mobile
- 768px — Tablet
- 1024px — Desktop
- 1280px — Wide desktop

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on `http://localhost:5000/api`
- Optional: Live Server for development

### Setup

#### Step 1: Clone Repository
```bash
git clone https://github.com/chaturvedikhyati/SmartSac.git
cd SmartSac
```

#### Step 2: Configure API Endpoint
Edit `js/core/api.js`:
```javascript
const API_CONFIG = {
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
};
```

#### Step 3: Run with Live Server (VS Code)
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

#### Step 4: Or Run with Python
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

#### Step 5: Or Run with Node.js
```bash
npm install -g http-server
http-server .
```

---

## 🔌 Backend API Endpoints

The frontend expects these backend endpoints:

### Classification
- `POST /api/classify` — Classify waste (multipart form with image/text)
- `GET /api/result/:id` — Get classification result

### History
- `GET /api/history` — Get user's classification history

### Dashboard
- `GET /api/dashboard` — Get dashboard statistics

### Admin
- `GET /api/admin/stats` — Admin statistics
- `GET /api/admin/classifications` — List all classifications
- `DELETE /api/admin/classifications/:id` — Delete classification
- `GET /api/admin/categories` — Get all categories
- `POST /api/admin/categories` — Create category
- `PUT /api/admin/categories/:id` — Update category
- `DELETE /api/admin/categories/:id` — Delete category

---

## 💻 Core Modules

### API Client (`js/core/api.js`)
Centralized fetch wrapper with error handling:
```javascript
const API = {
  classify: async (formData) => { ... },
  getResult: async (id) => { ... },
  getHistory: async (params) => { ... }
};
```

### Authentication (`js/core/auth.js`)
Token storage and user state:
```javascript
Auth.getToken()          // Get auth token
Auth.setToken(token)     // Set auth token
Auth.isAuthenticated()   // Check if logged in
Auth.logout()            // Clear auth
```

### Theme (`js/core/theme.js`)
Dark mode with system preference:
```javascript
Theme.getCurrentTheme()  // 'light' or 'dark'
Theme.setTheme(theme)    // Set theme
Theme.toggleTheme()      // Toggle between themes
```

### Router (`js/core/router.js`)
Client-side navigation:
```javascript
Router.navigate(path)    // Navigate to page
Router.goBack()          // Go back in history
Router.getQueryParams()  // Get URL params
```

---

## 🎨 Components

### Toast Notifications
```javascript
toast.success('Title', 'Message')
toast.error('Title', 'Message')
toast.warning('Title', 'Message')
toast.info('Title', 'Message')
```

### Modals
```javascript
const modal = new Modal({
  title: 'Modal Title',
  content: '<p>Content here</p>',
  buttons: [{ label: 'OK', onClick: () => {}, close: true }],
  onClose: () => {}
});
modal.open();
modal.close();
```

### Loader
```javascript
Loader.show('Loading...')   // Show loading overlay
Loader.hide()               // Hide loader
```

---

## 🧪 Testing

Run tests to verify functionality:
```bash
# Manual testing checklist
- [ ] Page loads without errors
- [ ] Dark mode toggle works
- [ ] Form validation works
- [ ] API calls succeed
- [ ] Mobile responsive
```

---

## ♿ Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Focus states on all buttons
- ✅ Alt text on images
- ✅ Keyboard navigation support
- ✅ Respects `prefers-reduced-motion`

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Netlify
```bash
npm install -D netlify-cli
netlify deploy
```

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in settings
3. Choose branch to deploy

### Traditional Server
- Copy all files to web server (Apache, Nginx)
- Ensure `.html` files served with correct MIME type
- Configure backend API CORS

---

## 🗺️ Roadmap

- [ ] Image classification with ML
- [ ] Real-time notifications
- [ ] User gamification system
- [ ] Eco-impact tracking
- [ ] Community challenges
- [ ] Integration with recycling centers
- [ ] Mobile app version
- [ ] Offline functionality

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commits
4. Push to your fork
5. Submit a Pull Request

---

## 📄 License

SmartSac Frontend is provided as-is for the SmartSac project.

---

## 👤 Author

**Khyati Chaturvedi**

- GitHub: [@chaturvedikhyati](https://github.com/chaturvedikhyati)
- LinkedIn: [linkedin.com/in/khyati-chaturvedi](https://www.linkedin.com/in/khyati-chaturvedi/)
- Repository: [SmartSac](https://github.com/chaturvedikhyati/SmartSac)

---

## 📞 Support

Found a bug or have suggestions? Open an [issue](https://github.com/chaturvedikhyati/SmartSac/issues) on GitHub.

---

<p align="center">Built with ❤️ and Vanilla JavaScript for the Planet 🌱</p>
