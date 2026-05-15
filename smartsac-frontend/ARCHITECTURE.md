# SmartSac Frontend Architecture

## Overview

SmartSac Frontend is a premium, production-grade web application built with vanilla HTML, CSS, and JavaScript. It follows a modular, layered architecture optimized for maintainability, scalability, and performance.

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│              Pages (index, upload, etc.)            │
├─────────────────────────────────────────────────────┤
│  Components (navbar, toast, modal, loader)          │
├─────────────────────────────────────────────────────┤
│  Core (api, auth, router, theme)                    │
├─────────────────────────────────────────────────────┤
│  Utils (formatters, validators)                     │
├─────────────────────────────────────────────────────┤
│  Styles (CSS with variables & responsive design)   │
└─────────────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. Pages Layer (`js/pages/`)
**Responsibility:** Page-specific business logic and UI updates

- **landing.js** - Hero animations, counters, FAQs, smooth scrolling
- **upload.js** - File upload, drag-drop, form validation, API submission
- **result.js** - Eco score calculation, instruction rendering, sharing
- **dashboard.js** - Chart rendering, data aggregation, statistics
- **history.js** - Filtering, pagination, grid rendering
- **admin.js** - CRUD operations, data management, table operations

Each page:
- Initializes on DOM ready
- Manages its own state
- Handles user interactions
- Updates UI dynamically
- Communicates via API and Core modules

### 2. Components Layer (`js/components/`)
**Responsibility:** Reusable UI components with self-contained logic

- **navbar.js** - Dynamic navbar with theme toggle, auth state, mobile menu
- **toast.js** - Toast notification system (success, error, warning, info)
- **modal.js** - Dialog/modal system with focus trap and keyboard handling
- **loader.js** - Full-page loading overlay with progress indication

Features:
- Singleton pattern for global components
- Event delegation
- Animation integration
- Accessibility support

### 3. Core Layer (`js/core/`)
**Responsibility:** Essential application infrastructure

#### api.js
- Centralized fetch wrapper
- Error handling and retry logic
- Token injection
- Request/response interceptors
- All backend endpoints defined

#### auth.js
- Token storage/retrieval
- User state management
- Authentication checks
- Token expiration handling
- Observer pattern for state changes

#### router.js
- Client-side routing
- URL parameter handling
- History management
- Authentication guards
- Link interception for SPA behavior

#### theme.js
- Dark/light mode toggle
- System preference detection
- CSS variable application
- Theme persistence

### 4. Utils Layer (`js/utils/`)
**Responsibility:** Pure utility functions with no side effects

#### formatters.js
Functions:
- `formatDate()` - Multiple date formats
- `formatRelativeTime()` - "2 hours ago" style
- `formatCategory()` - With emoji icons
- `formatConfidence()` - As percentage
- `formatFileSize()` - Bytes to KB/MB
- `formatNumber()` - With commas
- `formatItemName()` - Title case conversion

#### validators.js
Functions:
- `isEmail()` - Email validation
- `isStrongPassword()` - Password strength check
- `isValidItemName()` - Length validation (3-200)
- `isValidImageFile()` - File type and size check
- `isValidUrl()` - URL validation
- `isInRange()` - Number range check
- `validateForm()` - Bulk validation with schema
- `sanitize()` - XSS prevention

### 5. Styles Layer (`css/`)
**Responsibility:** Visual design and layout system

#### base.css (750+ lines)
- CSS custom properties (colors, spacing, typography)
- Reset and normalization
- Font imports (Instrument Serif, Inter, Playfair Display)
- Base typography styles
- Animations (slideUp, fadeIn, spin, float, pulse)
- Scrollbar styling
- Dark mode root variables
- Prefers-reduced-motion respect

#### components.css (600+ lines)
- Buttons (primary, secondary, ghost, danger, sizes)
- Cards with hover effects
- Badges (all category colors)
- Forms (inputs, selects, validation states)
- Toast notifications with positioning
- Modals with overlay and animations
- Loaders and spinners
- Pills and tags
- Progress bars (linear and circular)
- Empty states

#### layout.css (550+ lines)
- Navbar (fixed, scrolled state, responsive)
- Sidebar (collapsing on smaller screens)
- Footer with multi-column layout
- Grid systems (responsive columns)
- Flex utilities
- Page sections
- Container sizing
- Spacing utilities
- Responsive breakpoints

#### Page-Specific CSS
- **landing.css** (850+ lines) - Hero, features, categories, testimonials
- **upload.css** (400+ lines) - Upload zone, form inputs, validation states
- **result.css** (500+ lines) - Result layout, eco score circle, tabs
- **dashboard.css** (450+ lines) - Stat cards, charts, tables, activity
- **history.css** (400+ lines) - Filter bar, card grid, pagination
- **admin.css** (550+ lines) - Tabs, tables, forms, CRUD operations

## Data Flow

### Typical Classification Flow

```
1. Upload Page
   └─> upload.js validates file/text input
       └─> Calls API.classify() from api.js
           └─> Loader.show() displays overlay
               └─> Backend processes
                   └─> Returns result with ID
                       └─> Router navigates to /result.html?id=X
                           └─> Result Page
                               └─> result.js fetches result via API
                                   └─> Renders UI with eco score
                                       └─> User can share/re-classify/view history
```

### API Communication

```
Page Components
      ↓
  (form submission)
      ↓
  api.js (wrapper)
      ↓
  (add auth token, headers)
      ↓
  fetch(URL, options)
      ↓
  Backend API
      ↓
  response.json()
      ↓
  (error handling)
      ↓
  Return to page component
      ↓
  Page updates UI
      └─> Uses Formatters for display
      └─> Uses toast for feedback
      └─> Updates DOM directly or via innerHTML
```

## State Management

### Global State
- **Auth** - User token, user data, auth status
- **Theme** - Current theme (light/dark)
- **Router** - Current page, history stack, query params

### Local State
- **Page Components** - Results, filters, pagination, form data
- **Components** - Modal visibility, toast queue, loader state

### State Updates
- Direct property assignment for auth/theme
- Observer pattern for state change notifications
- DOM manipulation for UI updates
- Session storage for cross-page data transfer

## Styling Architecture

### CSS Variables (base.css)
```css
:root {
  --color-bg-primary: #f9f8f6;
  --color-accent: #3d6b4f;
  --spacing-lg: 24px;
  --fs-h1: clamp(2rem, 5vw, 3.5rem);
  /* ... etc */
}

html[data-theme="dark"] {
  --color-bg-primary: #141412;
  /* overrides for dark mode */
}
```

### Responsive Design Strategy
1. **Mobile First** - Base styles for mobile
2. **Progressive Enhancement** - Add complexity at breakpoints
3. **Fluid Typography** - Using `clamp()` for responsive font sizes
4. **Flexible Grids** - CSS Grid with auto-fit and minmax
5. **Touch-Friendly** - Larger click targets on mobile

## Performance Optimizations

1. **No Build Step** - Vanilla JS, no compilation needed
2. **No Dependencies** - Zero external libraries
3. **CSS Variables** - Fast theme switching without recompile
4. **Event Delegation** - Fewer event listeners
5. **Lazy Loading** - Images load on demand
6. **Semantic HTML** - Better parsing and rendering
7. **GPU Acceleration** - Transform-based animations
8. **Efficient Selectors** - Avoid over-complex CSS selectors

## Accessibility Considerations

1. **Semantic HTML** - Proper heading hierarchy, sections
2. **ARIA Labels** - Interactive elements have descriptions
3. **Focus States** - All interactive elements are keyboard accessible
4. **Color Contrast** - WCAG AA compliant ratios
5. **Prefers-Reduced-Motion** - Respects user preferences
6. **Alt Text** - Images have descriptions
7. **Form Validation** - Clear error messages
8. **Keyboard Navigation** - Full support without mouse

## Extensibility

### Adding New Pages
1. Create `yourpage.html`
2. Create `css/yourpage.css`
3. Create `js/pages/yourpage.js`
4. Import scripts and styles
5. Extend router and navbar

### Adding New Components
1. Create `js/components/yourcomponent.js`
2. Export class or singleton object
3. Add styles to appropriate CSS file
4. Initialize in page scripts

### Adding New API Endpoints
1. Add method to `API` object in `api.js`
2. Use `fetchAPI()` helper
3. Handle errors appropriately
4. Add TypeScript types if upgrading

## Migration Path

If you want to upgrade this project:

1. **TypeScript** - Add tsconfig.json, migrate gradually
2. **Module System** - Convert to ES6 modules with bundler
3. **Build Tool** - Add Vite/Webpack for optimization
4. **Framework** - Easy to migrate to React/Vue if needed
5. **Component Library** - Could become separate npm package

## Testing Strategy

Current: Manual testing via browser

Future recommendations:
- Unit tests with Jest (formatters, validators)
- Integration tests with Playwright (full flows)
- E2E tests on staging environment
- Visual regression testing for CSS

## Performance Targets

- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **Lighthouse Score** > 95

## Security Measures

1. **HTTPS Only** - In production
2. **CORS** - Backend should validate origins
3. **Input Validation** - Client-side + server-side
4. **XSS Prevention** - Sanitize user inputs
5. **CSRF Tokens** - Handled by backend
6. **Rate Limiting** - Implement on backend
7. **Token Expiration** - Auto logout on expiry

## File Size Impact

- **CSS Total** ~150KB (minified: ~80KB)
- **JS Total** ~120KB (minified: ~60KB)
- **HTML** ~50KB (minified: ~30KB)
- **Gzip (all)** ~30KB combined

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment Checklist

- [ ] Update API baseURL for production
- [ ] Set HTTPS
- [ ] Enable CORS on backend
- [ ] Add environment variables
- [ ] Configure CDN for static assets
- [ ] Enable compression (gzip)
- [ ] Set cache headers
- [ ] Test on production URL
- [ ] Verify analytics (if enabled)
- [ ] Monitor error logs

---

**Built with care for maintainability and performance 🌱**
