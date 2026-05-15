# SmartSac Frontend - Smart Waste Sorting Assistant

A production-grade, premium web application for intelligent waste classification and eco-friendly disposal guidance. Built with vanilla HTML, CSS, and JavaScript.

## Features

✅ **AI-Powered Classification** - Upload images or type item names for instant waste categorization  
✅ **Beautiful UI** - Premium design with smooth animations and dark mode support  
✅ **Responsive Design** - Perfect experience on desktop, tablet, and mobile  
✅ **Real-Time Feedback** - Dynamic loading states and instant notifications  
✅ **Admin Dashboard** - Full CRUD operations for waste categories and recommendations  
✅ **Eco Scoring** - Gamified sustainability tracking system  
✅ **No Dependencies** - Pure vanilla JavaScript, no frameworks or libraries  

## Project Structure

```
smartsac-frontend/
├── index.html              # Landing page
├── dashboard.html          # User dashboard
├── upload.html             # Upload/classify page
├── history.html            # Waste history page
├── result.html             # Classification result page
├── admin.html              # Admin panel
├── css/
│   ├── base.css            # CSS variables, reset, typography, animations
│   ├── components.css      # Buttons, cards, badges, toasts, modals
│   ├── layout.css          # Navbar, sidebar, footer, grid systems
│   ├── landing.css         # Landing page specific styles
│   ├── dashboard.css       # Dashboard page styles
│   ├── upload.css          # Upload page styles
│   ├── history.css         # History page styles
│   ├── result.css          # Result page styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── core/
│   │   ├── api.js          # Centralized API client
│   │   ├── auth.js         # Authentication state management
│   │   ├── router.js       # Client-side routing
│   │   └── theme.js        # Dark mode toggle
│   ├── components/
│   │   ├── navbar.js       # Dynamic navbar
│   │   ├── toast.js        # Toast notifications
│   │   ├── modal.js        # Modal dialogs
│   │   └── loader.js       # Loading overlay
│   ├── pages/
│   │   ├── landing.js      # Landing page logic
│   │   ├── upload.js       # Upload page logic
│   │   ├── result.js       # Result page logic
│   │   ├── dashboard.js    # Dashboard page logic
│   │   ├── history.js      # History page logic
│   │   └── admin.js        # Admin panel logic
│   └── utils/
│       ├── formatters.js   # Date, number, category formatting
│       └── validators.js   # Input validation helpers
└── assets/
    ├── icons/              # SVG icons (future)
    └── images/             # Hero illustrations (future)
```

## Design System

### Colors
- **Primary Background**: `#f9f8f6` (warm off-white)
- **Accent**: `#3d6b4f` (forest green)
- **Dark Mode BG**: `#141412`
- **Success**: `#10b981`
- **Error**: `#ef4444`
- **Warning**: `#f59e0b`

### Typography
- **Headings**: Instrument Serif / Playfair Display (Google Fonts)
- **Body**: Inter (Google Fonts)
- **Spacing**: 8px base grid system
- **Border Radius**: 12px cards, 8px inputs, 999px pills

### Responsive Breakpoints
- 480px - Mobile
- 768px - Tablet
- 1024px - Desktop
- 1280px - Wide desktop

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on `http://localhost:5000/api`
- Optional: Live Server or any HTTP server

### Setup

1. **Clone or download the repository**
   ```bash
   git clone <repo-url>
   cd smartsac-frontend
   ```

2. **Configure API endpoint**
   - Edit `js/core/api.js`
   - Change `baseURL` to your backend URL:
   ```javascript
   const API_CONFIG = {
     baseURL: 'https://your-api-domain.com/api',
     // ...
   };
   ```

3. **Run with Live Server (VS Code)**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"
   - Opens at `http://localhost:5500`

4. **Or run with Python**
   ```bash
   # Python 3
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

5. **Or run with Node.js**
   ```bash
   # Install http-server globally
   npm install -g http-server
   # Run server
   http-server .
   ```

## Backend API Endpoints

The frontend expects the following backend endpoints:

### Classification
- `POST /api/classify` - Classify waste (multipart form data with image or item text)
- `GET /api/result/:id` - Get classification result

### History
- `GET /api/history` - Get user's classification history (with pagination/filters)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/classifications` - List all classifications (paginated)
- `DELETE /api/admin/classifications/:id` - Delete classification
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/recommendations` - Get recommendations
- `POST /api/admin/recommendations` - Create recommendation
- `PUT /api/admin/recommendations/:id` - Update recommendation
- `DELETE /api/admin/recommendations/:id` - Delete recommendation

## Core Modules

### API Client (`js/core/api.js`)
Centralized fetch wrapper for all backend communication with error handling.

```javascript
const API = {
  classify: async (formData) => { ... },
  getResult: async (id) => { ... },
  getHistory: async (params) => { ... },
  // ... more endpoints
};
```

### Auth (`js/core/auth.js`)
Token storage and user state management.

```javascript
Auth.getToken()          // Get auth token
Auth.setToken(token)     // Set auth token
Auth.isAuthenticated()   // Check if logged in
Auth.logout()            // Clear auth
```

### Theme (`js/core/theme.js`)
Dark mode toggle with system preference detection.

```javascript
Theme.getCurrentTheme()  // 'light' or 'dark'
Theme.setTheme(theme)    // Set theme
Theme.toggleTheme()      // Toggle between themes
```

### Router (`js/core/router.js`)
Client-side navigation and page state.

```javascript
Router.navigate(path)    // Navigate to page
Router.goBack()          // Go back in history
Router.getQueryParams()  // Get URL params
```

## Components

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
  buttons: [
    { label: 'OK', onClick: () => {}, className: 'btn-primary', close: true }
  ],
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

## Utilities

### Formatters
```javascript
Formatters.formatDate(date, 'short')      // Format dates
Formatters.formatCategory(category)       // Format category name with emoji
Formatters.formatConfidence(value)        // Format as percentage
Formatters.formatFileSize(bytes)          // Format file size
Formatters.formatNumber(num)              // Format with commas
```

### Validators
```javascript
Validators.isEmail(email)                 // Validate email
Validators.isValidItemName(name)          // Validate item name (3-200 chars)
Validators.isValidImageFile(file)         // Validate image file
Validators.validateForm(data, schema)     // Validate entire form
Validators.sanitize(input)                // Sanitize XSS
```

## Styling

### CSS Variables
All colors, spacing, and typography are defined as CSS variables in `base.css`:

```css
--color-bg-primary: #f9f8f6;
--color-accent: #3d6b4f;
--spacing-lg: 24px;
--fs-h1: clamp(2rem, 5vw, 3.5rem);
/* ... etc */
```

### Dark Mode
Simply add `data-theme="dark"` to `<html>` element:
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

### Responsive Design
Media queries for breakpoints:
```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px) { /* Mobile */ }
@media (max-width: 480px) { /* Small mobile */ }
```

## Accessibility

- ✅ Semantic HTML (`<nav>`, `<main>`, `<section>`, etc.)
- ✅ ARIA labels on interactive elements
- ✅ Focus states on all buttons
- ✅ Alt text on images
- ✅ Keyboard navigation support
- ✅ Respects `prefers-reduced-motion`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **No dependencies** - Zero overhead from external libraries
- **CSS variables** - Fast theme switching
- **Lazy loading** - Images and sections load on demand
- **Optimized animations** - Use GPU-accelerated transforms
- **Efficient DOM updates** - Minimal reflows/repaints

## Development

### Adding a New Page

1. Create `yourpage.html` in root
2. Create `css/yourpage.css` for styles
3. Create `js/pages/yourpage.js` for logic
4. Import stylesheets and scripts in HTML
5. Update navbar links

### Adding a New Component

1. Create `js/components/yourcomponent.js`
2. Export class or object
3. Initialize in page scripts
4. Add styles to `css/components.css`

### Best Practices

- Always use CSS variables for colors/spacing
- Respect `prefers-reduced-motion` in animations
- Validate inputs before API calls
- Use `Loader` for async operations
- Use `toast` for user feedback
- Keep JavaScript modular and separated by page

## Common Issues

### API Connection Error
- Check backend is running on correct port
- Verify `API_CONFIG.baseURL` in `js/core/api.js`
- Check CORS headers from backend

### Styles Not Loading
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Ensure CSS files are in correct path
- Check browser console for 404 errors

### Dark Mode Not Working
- Ensure `js/core/theme.js` is loaded
- Check `data-theme` attribute on `<html>`
- Verify CSS variables are defined in all stylesheets

## Deployment

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
2. Enable GitHub Pages in repository settings
3. Choose branch to deploy

### Traditional Server
- Copy all files to web server (Apache, Nginx)
- Ensure `.html` files are served with correct MIME type
- Configure backend API CORS if on different domain

## License

SmartSac Frontend is provided as-is for the SmartSac project.

## Support

For issues, questions, or contributions, please contact the development team.

---

**Built with ❤️ and Vanilla JavaScript for the Planet 🌱**
