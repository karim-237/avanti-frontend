# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AVANTI Frontend v2.0 is a static HTML/JavaScript e-commerce website for rice products. It's a multi-page application without a modern JavaScript framework, using vanilla JS and jQuery to consume a REST API backend running on localhost:5000.

**Language**: French (UI text, content, date formatting)

## Development Commands

### Local Development
```bash
# Serve the site locally (requires a simple HTTP server)
cd public
python -m http.server 8000
# OR
npx serve public
```

### Backend API
The frontend expects a backend API running on `http://localhost:5000`

API must be running before testing the site, otherwise dynamic content will fail to load.

## Project Structure

```
Frontend v2.0/
├── public/                          # All static files served directly
│   ├── *.html                       # 15 page templates (index, products, blog, etc.)
│   ├── assets/
│   │   ├── api/
│   │   │   └── global.js            # MAIN API integration file (~1,244 lines)
│   │   ├── css/
│   │   │   ├── style.css            # Main design system & components
│   │   │   ├── responsive.css       # Mobile-first media queries
│   │   │   ├── shop.css             # Product/cart specific styles
│   │   │   └── blog.css             # Blog/recipe specific styles
│   │   ├── js/
│   │   │   ├── carousel.js          # Owl Carousel configurations
│   │   │   ├── contact-form.js      # Form validation & submission
│   │   │   ├── product-quantity.js  # Cart quantity management
│   │   │   ├── remove-product.js    # Cart item removal
│   │   │   └── [other utilities]
│   │   ├── images/                  # Static images & favicons
│   │   └── bootstrap/               # Bootstrap 5.x framework files
│   └── contact-form.php             # Legacy PHP form handler
└── .cursor/rules/systeme.mdc        # Tilda design system documentation
```

## Architecture Patterns

### 1. Centralized API Communication
All dynamic content is loaded via `assets/api/global.js`, which:
- Executes on `DOMContentLoaded`
- Fetches data from backend API endpoints
- Updates DOM elements using querySelector/querySelectorAll
- Uses page-specific conditional logic (`window.location.pathname.includes()`)

**Key API Endpoints:**
- `/api/site-settings` - Site title, logo, favicon, maintenance mode
- `/api/home-banners` - Homepage carousel content
- `/api/categories` - Product categories
- `/api/products` - Product listings (supports `?category={slug}` filtering)
- `/api/products/slug?slug={slug}` - Individual product details
- `/api/blogs` - Blog posts with pagination
- `/api/blogs/{slug}` - Individual blog post
- `/api/recipes/category/{slug}` - Recipes by category
- `/api/recipes/{slug}` - Individual recipe details

### 2. Query Parameter Navigation
Dynamic content is loaded based on URL query parameters:
- `?slug={item-slug}` for blog/recipe/product detail pages
- `?category={category-slug}` for filtered product/recipe listings

### 3. Template Pre-Population Pattern
HTML files contain placeholder elements that are populated by JavaScript:
```javascript
// HTML has empty elements
<img id="site-logo" alt="Logo" class="img-fluid">

// global.js populates them
const logo = document.getElementById("site-logo");
if (logo) logo.src = settings.logo_path;
```

### 4. Page-Specific Logic in global.js
Code is organized by page type with conditional execution:
```javascript
if (window.location.pathname.includes("single-blog.html")) {
  // Blog-specific logic here
}
```

### 5. No Build Process
All assets are served as-is. No webpack, bundling, or transpilation. Changes to JS/CSS are immediately reflected.

## Key Technologies

- **jQuery 3.7.1** - DOM manipulation and AJAX
- **Bootstrap 5.x** - Responsive grid and components
- **Owl Carousel** - Image sliders and product carousels
- **AOS (Animate On Scroll)** - Scroll-triggered animations
- **Magnific Popup** - Lightbox modals for images
- **Font Awesome 6.5.1** (CDN) - Icon library

## Page Types

### Core Pages
- `index.html` - Homepage with hero carousel, featured products, testimonials
- `products.html` - Product catalog with category filtering
- `product-detail.html` - Individual product (uses `?slug=` parameter)
- `blog.html` - Blog listing with category tabs
- `single-blog.html` - Blog post detail (uses `?slug=` parameter)
- `recette.html` - Recipe listings by category
- `single-recipe.html` - Recipe detail (uses `?slug=` parameter)
- `about.html` - Company information with statistics
- `contact.html` - Contact form with validation

### Utility Pages
- `coming-soon.html` - Maintenance mode redirect target
- `404.html` - Error page
- `faq.html` - Frequently asked questions
- Policy pages: `privacy-policy.html`, `cookie-policy.html`, `term-of-use.html`

## Common Development Tasks

### Adding a New Page
1. Create new HTML file in `public/` directory
2. Copy header/footer structure from existing page
3. Add page-specific content in main section
4. If dynamic content needed, add fetch logic to `assets/api/global.js`
5. Use conditional check: `if (window.location.pathname.includes("your-page.html"))`

### Modifying API Integration
All API calls are in `assets/api/global.js`. Find the relevant section comment (e.g., "FETCH PRODUCTS") and modify the fetch logic.

### Updating Styles
- **Global changes**: Edit `assets/css/style.css`
- **Responsive breakpoints**: Edit `assets/css/responsive.css`
- **Shop-specific**: Edit `assets/css/shop.css`
- **Blog-specific**: Edit `assets/css/blog.css`

### Working with Carousels
Owl Carousel instances are configured in `assets/js/carousel.js`. Each section (testimonials, products) has separate configuration with responsive breakpoints.

### Form Handling
Contact forms use jQuery validation plugin. Main logic in `assets/js/contact-form.js`. Backend submission to PHP endpoint or API depending on form type.

## Design System (from .cursor/rules/systeme.mdc)

### Color Palette
- **Primary Blue**: `#2C3E50`
- **Medium Blue**: `#3C5189`
- **Accent Yellow**: `#FFC107` (CTA buttons)
- **Magenta/Pink**: `#E91E63`
- **Orange/Red**: `#E84C3D`
- **Cyan/Green**: `#00BFA5`
- **Light Gray**: `#F5F5F5`
- **White**: `#FFFFFF`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Roboto, Arial (sans-serif)
- **H1**: 32-48px
- **H2**: 24-32px
- **Body**: 14-16px

### Spacing System (8px base)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Responsive Breakpoints
```css
@media (min-width: 480px)  /* Small tablet */
@media (min-width: 768px)  /* Tablet */
@media (min-width: 1024px) /* Desktop */
@media (min-width: 1440px) /* Large desktop */
```

### Button Styles
- **Primary**: Yellow (`#FFC107`), padding 12-16px, border-radius 8px
- **Secondary**: Blue transparent with 2px border
- **Hover**: opacity 0.8, 300ms transition

## Important Conventions

### Maintenance Mode
Site settings API endpoint includes `maintenance_mode` boolean. When true, all pages redirect to `coming-soon.html`.

### Cart Management
Shopping cart is client-side only (no backend persistence visible). Tax rate: 5%, Shipping: $15 (hardcoded).

### Error Handling
All fetch calls use `.catch()` to log errors to console. No user-facing error messages for API failures - content simply doesn't load.

### Loading States
HTML includes "Chargement..." (Loading) text as placeholders, replaced when API data arrives.

### Localization
All dates formatted with French locale: `toLocaleDateString('fr-FR')`. UI text is in French.

## Mobile-First Approach

The site follows mobile-first responsive design:
- Base styles target mobile (320px+)
- Media queries progressively enhance for larger screens
- Bootstrap grid: `col-12` (mobile) → `col-md-6` (tablet) → `col-lg-4` (desktop)
- Header switches to hamburger menu on mobile
- Carousel shows 1 item on mobile, 2-3 on tablet, 4+ on desktop

## Performance Considerations

- **No lazy loading** implemented for images
- **CDN dependencies**: Font Awesome loaded externally (potential SPOF)
- **Large global.js**: Consider code-splitting for production
- **jQuery dependency**: All pages load full jQuery even if minimally used

## Known Patterns to Follow

1. **Never modify HTML structure** without checking if `global.js` targets those elements
2. **Selector-based updates**: global.js uses specific class/ID selectors - maintain them
3. **Script loading order matters**: jQuery must load before other scripts
4. **API responses expected format**: global.js assumes specific JSON structures
5. **French text conventions**: Maintain French language for all UI elements

## Tilda Design System Reference

The `.cursor/rules/systeme.mdc` file contains comprehensive design guidelines from the original Tilda CMS export. Consult it for:
- Component specifications (cards, buttons, forms)
- Layout patterns for each page type
- Accessibility requirements (WCAG 2.1)
- Animation and interaction patterns
- Complete page structure documentation for all 14+ pages

This documentation provides implementation details, code examples, and best practices aligned with the original Tilda design.
