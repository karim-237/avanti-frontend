# PLAN DE MIGRATION COMPLET - AVANTI vers TILDA DESIGN

**Date de création:** 2025-01-27  
**Objectif:** Faire ressembler l'entièreté du site AVANTI à www.tilda.com selon la documentation Tilda Google Docs et le système de design

---

## 📊 ANALYSE RAPIDE DU SITE ACTUEL

### Structure Actuelle
- **Framework:** Bootstrap 5.x avec jQuery 3.7.1
- **Pages:** 15 pages HTML (index, products, product-detail, blog, single-blog, recette, single-recipe, about, contact, faq, etc.)
- **API Backend:** localhost:5000 (REST API)
- **CSS:** Variables déjà en place (variables.css), mais design legacy Bootstrap
- **Navigation:** Home, À propos, Our products, Blog, Recettes, Contacts
- **Header:** Logo, search, cart, admin icons

### Points Forts à Conserver
- ✅ Variables CSS Tilda déjà définies
- ✅ Architecture JavaScript modulaire (API client, main.js)
- ✅ Structure HTML sémantique de base
- ✅ Responsive design partiel

### Points à Migrer vers Tilda
- ❌ Navigation (actuelle: 6 items simples → Tilda: Shop, Product Ranges, Recipes, Discover, Rice Sustainability)
- ❌ Header (manque sélecteur pays/région, repositionnement recherche)
- ❌ Homepage structure (actuelle: sections génériques → Tilda: Hero carousel 5 slides, Tilda Products, New Flavour Recipes, From the Blog, Instagram grid)
- ❌ Product Ranges page (manque cercles colorés avec images)
- ❌ Shop page (manque filtres avancés sidebar)
- ❌ Design system (couleurs, typographie, composants)

---

## 🎯 PLAN DE MIGRATION - 20 PHASES

### **PHASE 1 - FONDATIONS & DESIGN SYSTEM**

#### 1.1 Variables CSS Tilda Complètes
**Fichier:** `/fr/assets/css/variables.css`

**Actions:**
- ✅ Vérifier toutes les couleurs Tilda exactes:
  - Primary: `#2C3E50` (Bleu foncé)
  - Secondary: `#3C5189` (Bleu moyen)
  - Accent: `#FFC107` (Jaune - boutons CTA)
  - Magenta: `#E91E63` (Rose/Magenta)
  - Orange: `#E84C3D` (Orange/Rouge)
  - Cyan: `#00BFA5` (Cyan/Vert)
- ✅ Ajouter variables manquantes si nécessaire
- ✅ Vérifier espacements (8px base: xs=4px, sm=8px, md=16px, lg=24px, xl=32px, 2xl=48px)

#### 1.2 Typographie Tilda
**Fichiers:** `/fr/assets/css/typography.css`, `/fr/assets/css/variables.css`

**Actions:**
- ✅ Implémenter Roboto Display pour headings (serif)
- ✅ Implémenter Roboto pour body (sans-serif)
- ✅ Tailles fluides avec clamp():
  - H1: `clamp(2rem, 5vw + 1rem, 3rem)` (32-48px)
  - H2: `clamp(1.5rem, 4vw + 0.5rem, 2rem)` (24-32px)
  - Body: `clamp(0.875rem, 2vw, 1rem)` (14-16px)
- ✅ Line heights: tight=1.2, normal=1.5, relaxed=1.6

#### 1.3 Composants Réutilisables
**Fichier:** `/fr/assets/css/components.css` (nouveau)

**Actions:**
- ✅ Bouton PRIMARY: Jaune `#FFC107`, padding 12-16px, border-radius 8px, hover opacity 0.8
- ✅ Bouton SECONDARY: Bleu transparent, border 2px
- ✅ Cards: border-radius 12-16px, shadow `0 4px 12px rgba(0,0,0,0.1)`, hover scale(1.05)
- ✅ Form inputs: padding 12px 16px, border-radius 8px, focus color accent

---

### **PHASE 2 - HEADER & NAVIGATION**

#### 2.1 Sélecteur de Pays/Région
**Fichier:** Tous les fichiers HTML (header commun)

**Actions:**
- ✅ Ajouter dropdown sélecteur pays/région dans header (gauche du logo ou droite)
- ✅ Style Tilda (dropdown moderne avec flags/icons)
- ✅ JavaScript: `/fr/assets/js/country_dropdown.js` (existe déjà, adapter)

#### 2.2 Navigation Principale
**Fichier:** Tous les fichiers HTML (header commun)

**Actions:**
- ✅ Remplacer menu actuel par:
  - **Shop** (lien vers /en/products.html)
  - **Product Ranges** (lien vers /en/products.html#ranges)
  - **Recipes** (lien vers /en/recette.html)
  - **Discover** (nouveau - page découverte/blog)
  - **Rice Sustainability** (nouveau - page sustainability)
- ✅ Style navigation Tilda (hover effects, active states)

#### 2.3 Barre de Recherche
**Fichier:** Tous les fichiers HTML (header commun)

**Actions:**
- ✅ Repositionner recherche au centre du header (entre logo et navigation)
- ✅ Style Tilda (input moderne avec icon search)
- ✅ JavaScript: `/fr/assets/js/search.js` (existe déjà, adapter)

#### 2.4 Icônes Utilisateur
**Fichier:** Tous les fichiers HTML (header commun)

**Actions:**
- ✅ Remplacer "admin" icon par **Account** icon (utilisateur)
- ✅ Conserver **Basket** icon avec compteur
- ✅ Position droite du header

#### 2.5 Header Sticky Mobile
**Fichier:** `/fr/assets/css/responsive.css`

**Actions:**
- ✅ Header sticky au top sur mobile
- ✅ Hamburger menu amélioré (animation smooth)
- ✅ Mobile menu avec tous les items navigation

---

### **PHASE 3 - HOMEPAGE (/en/index.html)**

#### 3.1 Hero Carousel
**Fichier:** `/en/index.html`, `/fr/assets/js/carousel.js`

**Actions:**
- ✅ Remplacer carousel Bootstrap par Splide ou Owl Carousel
- ✅ 5 slides avec images promotionnelles
- ✅ Navigation: arrows prev/next (gauche/droite)
- ✅ Pagination dots (5 dots correspondant aux slides)
- ✅ Touch swipe support mobile
- ✅ Transition smooth 300-500ms ease-in-out
- ✅ Auto-play optionnel (désactivé par défaut)

#### 3.2 Section Tilda Products
**Fichier:** `/en/index.html`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Titre section: "Tilda Products"
- ✅ Description courte
- ✅ 4 catégories principales (cards)
- ✅ Carrousel produits (4-5 produits par vue desktop, 2-3 tablet, 1 mobile)
- ✅ Navigation arrows + pagination dots
- ✅ Infinite scroll (wrap around)

#### 3.3 Section New Flavour Recipes
**Fichier:** `/en/index.html`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Titre section: "New Flavour Recipes"
- ✅ 2-3 cartes de recettes avec:
  - Image du plat
  - Titre recette
  - Catégorie badge
  - Description courte
  - Lien "View Recipe"
- ✅ Hover effects: scale(1.05), opacity transition

#### 3.4 Section From the Blog
**Fichier:** `/en/index.html`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Titre section: "From the Blog"
- ✅ 2-3 articles featured avec:
  - Thumbnail image
  - Category tag
  - Titre article
  - Date publication (format French)
  - Description courte
  - Lien vers /en/single-blog.html

#### 3.5 Section About Us
**Fichier:** `/en/index.html`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Image + texte descriptif
- ✅ Statistiques (années d'expérience, satisfaction, produits vendus)
- ✅ Lien "Lire Plus" vers /en/about.html

#### 3.6 Section Instagram
**Fichier:** `/en/index.html`

**Actions:**
- ✅ Grid 4x4 images (16 images total)
- ✅ Layout responsive:
  - Desktop: 4 images par row
  - Tablet: 2 images par row
  - Mobile: 1 image par row
- ✅ Images carrées (aspect-ratio 1:1)
- ✅ Gap 16px entre images
- ✅ Lien vers Instagram sur chaque image (ouverture nouvelle fenêtre)

#### 3.7 Section Newsletter
**Fichier:** `/en/index.html`, `/fr/assets/js/contact-form.js`

**Actions:**
- ✅ Formulaire d'inscription email
- ✅ Style Tilda (input moderne, bouton jaune CTA)
- ✅ Validation email côté client
- ✅ Soumission API backend
- ✅ Messages success/error

---

### **PHASE 4 - PRODUCT RANGES PAGE**

#### 4.1 Hero & Tab Selector
**Fichier:** `/en/products.html`

**Actions:**
- ✅ Hero titre: "Tilda Products"
- ✅ Tab selector: "All Products" actif (par défaut)
- ✅ Tab "Shop" (lien vers /en/products.html?view=shop)

#### 4.2 Circular Category Cards
**Fichier:** `/en/products.html`, `/fr/assets/css/shop.css`

**Actions:**
- ✅ Créer cercles colorés avec images de fond:
  - **Microwave Rice** - background rose `#E91E63`
  - **Dry Rice** - background cyan `#00BFA5`
  - **Jasmine Rice** - background jaune `#FFC107`
  - **Boil-in-Bag Rice** - background orange `#E84C3D`
  - **Bundles** - background orange `#E84C3D`
  - **Kids Rice** - background vert `#00BFA5`
  - Plus 7+ autres ranges
- ✅ Images produits en overlay
- ✅ Text overlay avec titre catégorie
- ✅ Hover effect: scale(1.05), opacity 0.8

---

### **PHASE 5 - SHOP PAGE (/en/products.html avec filtres)**

#### 5.1 Breadcrumb Navigation
**Fichier:** `/en/products.html`

**Actions:**
- ✅ Breadcrumb: `HOME > PRODUCTS > SHOP ALL`
- ✅ Style Tilda (liens cliquables, séparateur >)

#### 5.2 Hero & Tab Selector
**Fichier:** `/en/products.html`

**Actions:**
- ✅ Hero titre: "Tilda Products"
- ✅ Tab selector: "Shop" vs "All Products"
- ✅ JavaScript: toggle entre vues

#### 5.3 LEFT SIDEBAR - Category Cards
**Fichier:** `/en/products.html`, `/fr/assets/css/shop.css`

**Actions:**
- ✅ Section filtres gauche (sidebar sticky)
- ✅ Category cards: Bundles, Kids, Pick n Mix, Shop All
- ✅ Style cards Tilda (hover effects)

#### 5.4 LEFT SIDEBAR - Type Filter
**Fichier:** `/en/products.html`

**Actions:**
- ✅ Checkboxes: Basmati, Easy-cook, Jasmine, Long grain, Medium grain, Pilau, Wholegrain, Wild
- ✅ Style checkboxes Tilda
- ✅ JavaScript: filtrage produits

#### 5.5 LEFT SIDEBAR - Dietary Filter
**Fichier:** `/en/products.html`

**Actions:**
- ✅ Checkboxes: Plant Based, Dairy-free, Gluten Free, High Fibre, Lactose-free, Vegan, Vegetarian
- ✅ Icons pour chaque option si disponible

#### 5.6 LEFT SIDEBAR - Flavour Filter
**Fichier:** `/en/products.html`

**Actions:**
- ✅ Checkboxes: Coconut, Curry, Egg, Herb, Lime, Mexican, Mushroom, Plain, Spicy, Sweet, Tomato, Vegetable

#### 5.7 LEFT SIDEBAR - Suitable Cuisine
**Fichier:** `/en/products.html`

**Actions:**
- ✅ Checkboxes: Caribbean, Chinese, Indian, Japanese, Mediterranean, Mexican, South African, Thai

#### 5.8 LEFT SIDEBAR - Clear All Filters
**Fichier:** `/en/products.html`, `/fr/assets/js/filter-button.js`

**Actions:**
- ✅ Bouton "Clear All Filters"
- ✅ JavaScript: reset tous les filtres

#### 5.9 Product Grid
**Fichier:** `/en/products.html`, `/fr/assets/css/shop.css`

**Actions:**
- ✅ Grid produits: 4-5 par ligne desktop, 2-3 tablet, 1 mobile
- ✅ Product card avec:
  - Image du produit
  - Badge prix réduit affiché (£5 off, £3 off, Save 20%)
  - Titre du produit
  - Catégorie (Dry Rice, Microwave Rice, Ready Meals)
  - Prix (ancien barré & nouveau)
  - Bouton "Add to basket"
  - Lien "View"
- ✅ Hover effects sur cards

---

### **PHASE 6 - PRODUCT DETAIL PAGE**

#### 6.1 Breadcrumb
**Fichier:** `/en/product-detail.html`

**Actions:**
- ✅ Breadcrumb: `HOME > PRODUCTS > PRODUCT NAME`
- ✅ Dynamique selon produit chargé

#### 6.2 Layout 2-Column
**Fichier:** `/en/product-detail.html`, `/fr/assets/css/shop.css`

**Actions:**
- ✅ **LEFT:** Product image avec background couleur (selon catégorie)
- ✅ **RIGHT:**
  - Category badge (ex: "Microwave Rice")
  - Titre produit complet
  - Icons allergènes: Gluten Free, Vegan, Vegetarian (avec icons)
  - Rating system 5 stars
  - Prix (ancien & nouveau si réduit)
  - Bouton "Add to basket" (jaune CTA)
  - Informations nutritionnelles
  - Description détaillée
  - Bouton "Save or print recipe" (jaune CTA)
  - Product badges (No Added Sugar, etc.)

#### 6.3 Related Products Carousel
**Fichier:** `/en/product-detail.html`, `/fr/assets/js/carousel.js`

**Actions:**
- ✅ Carrousel produits similaires sous le produit principal
- ✅ 4-5 produits par vue desktop
- ✅ Navigation arrows + pagination dots

#### 6.4 Usage Suggestions & Recipes
**Fichier:** `/en/product-detail.html`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Section "Usage Suggestions"
- ✅ Section "Recipes using this product" (liens vers recettes)

---

### **PHASE 7 - RECIPES PAGE**

#### 7.1 Hero
**Fichier:** `/en/recette.html`, `/fr/assets/css/blog.css`

**Actions:**
- ✅ Hero: "Our Recipes" titre blanc
- ✅ Background rose magenta `#E91E63`
- ✅ Description: "Recipe ideas and inspiration for a world full of flavour"

#### 7.2 Tab Selector
**Fichier:** `/en/recette.html`

**Actions:**
- ✅ Tabs: "Recipes" (actif) vs "Meal Planner"
- ✅ JavaScript: toggle entre vues

#### 7.3 Search Bar
**Fichier:** `/en/recette.html`

**Actions:**
- ✅ Search bar: "Search for ingredients, flavours, cuisines and more"
- ✅ JavaScript: filtrage recettes en temps réel

#### 7.4 Recipe Cards
**Fichier:** `/en/recette.html`, `/fr/assets/css/blog.css`

**Actions:**
- ✅ Grid recipe cards avec:
  - Image du plat
  - Titre recette
  - Catégorie badge
  - Description courte
  - Lien "View Recipe"
  - Lien "Read Article" (si article associé)
- ✅ Hover effects

---

### **PHASE 8 - RECIPE SINGLE PAGE**

#### 8.1 Breadcrumb
**Fichier:** `/en/single-recipe.html`

**Actions:**
- ✅ Breadcrumb: `HOME > RECIPES > RECIPE NAME`

#### 8.2 Layout 2-Column
**Fichier:** `/en/single-recipe.html`, `/fr/assets/css/blog.css`

**Actions:**
- ✅ **LEFT:** Image du plat (colourful background)
- ✅ **RIGHT:**
  - Titre: "Chinese BBQ Spare Ribs" (exemple)
  - Description courte
  - Icons metadata:
    - Temps: "120+ Minutes"
    - Difficulté: "Easy"
    - Portions: "Serves 2"
  - Rating system 5 stars
  - Bouton "Save or print recipe" (jaune CTA)
  - Section "This recipe uses:" avec produits Tilda (liens vers produits)

#### 8.3 Ingredients & Instructions
**Fichier:** `/en/single-recipe.html`

**Actions:**
- ✅ Liste ingrédients (format liste)
- ✅ Instructions step-by-step (numérotées)

#### 8.4 Related Content
**Fichier:** `/en/single-recipe.html`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Section "Related recipes" (carrousel)
- ✅ Section "Product recommendations" (produits utilisés dans la recette)

---

### **PHASE 9 - BLOG PAGE**

#### 9.1 Hero
**Fichier:** `/en/blog.html`, `/fr/assets/css/blog.css`

**Actions:**
- ✅ Hero: "Tilda Blog" titre blanc
- ✅ Background orange/rouge `#E84C3D`

#### 9.2 Tab Navigation Categories
**Fichier:** `/en/blog.html`

**Actions:**
- ✅ Tabs: All, Campaigns, Cooking Inspiration, Cuisine Guide, Culture Guide, Equipment Guide, Health Dietary, Ingredient Guide, Kids
- ✅ JavaScript: filtrage articles par catégorie

#### 9.3 Featured & Popular Sections
**Fichier:** `/en/blog.html`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Featured section (top) - 1-2 articles mis en avant
- ✅ Popular section - articles populaires

#### 9.4 Grid Articles
**Fichier:** `/en/blog.html`, `/fr/assets/css/blog.css`

**Actions:**
- ✅ Grid de cards avec:
  - Thumbnail image
  - Category tag
  - Titre article
  - Date de publication (format French)
  - Description courte
- ✅ Hover effects

---

### **PHASE 10 - BLOG ARTICLE PAGE**

#### 10.1 Structure Complète
**Fichier:** `/en/single-blog.html`, `/fr/assets/css/blog.css`

**Actions:**
- ✅ Breadcrumb navigation
- ✅ Featured image (full width)
- ✅ Titre article
- ✅ Date & author info
- ✅ Content body (format markdown/HTML)
- ✅ Related articles (carrousel)
- ✅ CTA sections (newsletter, produits)

---

### **PHASE 11 - ABOUT US PAGE**

#### 11.1 Hero Image Overlay
**Fichier:** `/en/about.html`, `/fr/assets/css/sections/about.css` (nouveau)

**Actions:**
- ✅ Breadcrumb: `HOME > ABOUT US`
- ✅ Hero image avec texte overlay blanc:
  - "About Tilda"
  - "We're on a mission to embrace life..."

#### 11.2 Content Sections
**Fichier:** `/en/about.html`

**Actions:**
- ✅ Texte description full width
- ✅ Section "Where to Buy" (lien)
- ✅ Newsletter CTA

---

### **PHASE 12 - FAQS PAGE**

#### 12.1 Hero & Tabs
**Fichier:** `/en/faq.html`, `/fr/assets/css/sections/faq.css` (nouveau)

**Actions:**
- ✅ Breadcrumb: `HOME > FAQS`
- ✅ Hero: "FAQs" titre blanc sur fond bleu `#2C3E50`
- ✅ Subtitle: "See below our answers..."
- ✅ Tab navigation (Jump to): Company, Nutritional & Dietary, Products, Tilda Online Shop

#### 12.2 Accordion FAQ Items
**Fichier:** `/en/faq.html`, `/fr/assets/js/faq.js` (nouveau)

**Actions:**
- ✅ Accordion/Expandable format
- ✅ Question text (clickable)
- ✅ Answer text reveal (smooth animation)
- ✅ JavaScript: toggle expand/collapse

---

### **PHASE 13 - CONTACT US PAGE**

#### 13.1 Hero & Transition
**Fichier:** `/en/contact.html`, `/fr/assets/css/sections/contact.css` (nouveau)

**Actions:**
- ✅ Breadcrumb: `HOME > ABOUT US > CONTACT US`
- ✅ Hero: "Contact Us" titre blanc
- ✅ Description: "Our consumer care team are here to help..."
- ✅ Wavy transition vers section rouge/corail `#E84C3D`

#### 13.2 Form & Contact Info
**Fichier:** `/en/contact.html`, `/fr/assets/js/contact-form.js`

**Actions:**
- ✅ Form fields pour message
- ✅ Phone number affiché
- ✅ Email address affiché
- ✅ Office hours: Monday-Friday 9am-5pm
- ✅ Validation formulaire
- ✅ Soumission API

---

### **PHASE 14 - FOOTER**

#### 14.1 Structure Complète
**Fichier:** Tous les fichiers HTML (footer commun)

**Actions:**
- ✅ Réseaux sociaux (Facebook, Instagram, YouTube)
- ✅ Section Food Service (lien)
- ✅ Liens navigation secondaire
- ✅ Liens légaux: Terms, Privacy, Cookie preferences
- ✅ Copyright
- ✅ Style Tilda (multi-colonnes responsive)

---

### **PHASE 15 - RESPONSIVE DESIGN**

#### 15.1 Mobile-First Approach
**Fichier:** `/fr/assets/css/responsive.css`

**Actions:**
- ✅ Base styles: Mobile (320px - 480px)
- ✅ 1 colonne, hamburger menu, stack layout
- ✅ Touch targets 44px+ (iOS)
- ✅ Font size 16px+ (iOS safe zoom)

#### 15.2 Tablet Breakpoints
**Fichier:** `/fr/assets/css/responsive.css`

**Actions:**
- ✅ Breakpoint 768px: 2 colonnes pour cartes
- ✅ Nav items visibles inline
- ✅ Carousels: 2-3 items par vue

#### 15.3 Desktop Breakpoints
**Fichier:** `/fr/assets/css/responsive.css`

**Actions:**
- ✅ Breakpoint 1024px: 3-4 colonnes
- ✅ Full horizontal layout
- ✅ Carousels: 4-5 items par vue
- ✅ Breakpoint 1440px: Large desktop optimizations

---

### **PHASE 16 - CAROUSELS & INTERACTIONS**

#### 16.1 Hero Carousel
**Fichier:** `/fr/assets/js/carousel.js` ou utiliser Splide

**Actions:**
- ✅ 1 slide visible à la fois
- ✅ Arrows prev/next (gauche/droite)
- ✅ Pagination dots (5 dots pour 5 slides)
- ✅ Touch swipe support mobile
- ✅ Transition 300-500ms ease-in-out
- ✅ Auto-play optionnel

#### 16.2 Product Carousel
**Fichier:** `/fr/assets/js/carousel.js`

**Actions:**
- ✅ 4-5 produits desktop, 2-3 tablet, 1 mobile
- ✅ Infinite scroll (wrap around)
- ✅ Navigation arrows + pagination dots
- ✅ Smooth animation

---

### **PHASE 17 - JAVASCRIPT & API**

#### 17.1 API Homepage
**Fichier:** `/fr/assets/api/global.js`

**Actions:**
- ✅ Mettre à jour pour nouvelles sections:
  - Hero carousel (5 banners)
  - Tilda Products (4 catégories + produits)
  - New Flavour Recipes (2-3 recettes)
  - From the Blog (2-3 articles)
  - Instagram feed (16 images)
- ✅ Endpoints API backend:
  - `/api/home-banners` (5 banners)
  - `/api/categories` (4 principales)
  - `/api/products?featured=true` (produits featured)
  - `/api/recipes?featured=true&limit=3`
  - `/api/blogs?featured=true&limit=3`
  - `/api/instagram-feed` (ou intégration API Instagram)

#### 17.2 Filtres Produits
**Fichier:** `/fr/assets/js/filter-button.js`, `/fr/assets/api/global.js`

**Actions:**
- ✅ Logique de filtrage côté client (ou API)
- ✅ Filtres combinables (Type + Dietary + Flavour + Cuisine)
- ✅ Mise à jour grid produits en temps réel
- ✅ Compteur résultats affiché

#### 17.3 Tabs Functionality
**Fichier:** `/fr/assets/js/main.js` ou nouveau `/fr/assets/js/tabs.js`

**Actions:**
- ✅ Tabs "Shop" vs "All Products" (/en/products.html)
- ✅ Tabs "Recipes" vs "Meal Planner" (/en/recette.html)
- ✅ Tabs Blog categories (blog.html)
- ✅ Smooth transition entre tabs

---

### **PHASE 18 - ACCESSIBILITE & SEO**

#### 18.1 HTML Sémantique
**Fichier:** Tous les fichiers HTML

**Actions:**
- ✅ Utiliser: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ✅ Proper h1, h2, h3 hierarchy (1 seul h1 par page)
- ✅ Alt text descriptif pour toutes images
- ✅ Form labels liés aux inputs (`<label for="id">`)

#### 18.2 ARIA Labels
**Fichier:** Tous les fichiers HTML

**Actions:**
- ✅ `aria-label` pour icônes (search, cart, account)
- ✅ `aria-hidden="true"` pour éléments décoratifs
- ✅ `role="button"` sur éléments clickable non-boutons
- ✅ `aria-live="polite"` pour notifications dynamiques
- ✅ `aria-expanded` pour dropdowns/accordions

#### 18.3 Color Contrast & Keyboard
**Fichier:** `/fr/assets/css/style.css`, `/fr/assets/css/components.css`

**Actions:**
- ✅ Color contrast 4.5:1 pour body text
- ✅ Color contrast 3:1 pour large text (18pt+)
- ✅ Keyboard navigation: Tab accessible partout
- ✅ `:focus-visible` visible et stylé
- ✅ Tab order logique
- ✅ Escape pour fermer modals/dropdowns

---

### **PHASE 19 - PERFORMANCE**

#### 19.1 Images Optimization
**Fichier:** Tous les fichiers HTML

**Actions:**
- ✅ Lazy loading: `loading="lazy"` sur images below fold
- ✅ Responsive images: `srcset` et `sizes` attributes
- ✅ WebP format avec fallback PNG/JPG
- ✅ Compression images (TinyPNG, ImageOptim)

#### 19.2 CSS Optimization
**Fichier:** Build process ou manuel

**Actions:**
- ✅ Minifier CSS avant production
- ✅ Critical CSS inline en `<head>`
- ✅ Defer non-critical CSS
- ✅ Remove unused CSS (PurgeCSS si build process)

#### 19.3 JavaScript Optimization
**Fichier:** Tous les fichiers HTML

**Actions:**
- ✅ Defer scripts: `<script defer>`
- ✅ Code splitting si nécessaire
- ✅ Utiliser CDN pour libraries (jQuery, Font Awesome déjà en CDN)
- ✅ Minimize JavaScript bundle

---

### **PHASE 20 - POLISH & TESTING**

#### 20.1 Cross-Browser Testing
**Actions:**
- ✅ Chrome (desktop & mobile)
- ✅ Firefox (desktop & mobile)
- ✅ Safari (desktop & iOS)
- ✅ Edge (desktop)

#### 20.2 Mobile Testing
**Actions:**
- ✅ iOS Safari (iPhone 12+, iPad)
- ✅ Chrome Android (Samsung, Pixel)
- ✅ Touch targets 44px+ vérifiés
- ✅ Font size 16px+ vérifiés
- ✅ Viewport meta tag correct
- ✅ Safe area insets (notches)

#### 20.3 Performance Audit
**Actions:**
- ✅ Google Lighthouse (score 90+ desktop & mobile)
- ✅ Core Web Vitals:
  - FCP < 1.8s
  - LCP < 2.5s
  - CLS < 0.1
  - First Interactive < 3.8s

#### 20.4 Accessibility Audit
**Actions:**
- ✅ WAVE tool (zero errors)
- ✅ Keyboard navigation test complet
- ✅ Screen reader test (NVDA/JAWS)
- ✅ Color contrast checker

---

## 📋 CHECKLIST DE VALIDATION

### Design System
- [ ] Couleurs Tilda exactes appliquées partout
- [ ] Typographie Roboto Display + Roboto
- [ ] Espacements 8px base respectés
- [ ] Boutons PRIMARY jaune #FFC107
- [ ] Cards border-radius 12-16px

### Navigation & Header
- [ ] Sélecteur pays/région fonctionnel
- [ ] Navigation: Shop, Product Ranges, Recipes, Discover, Rice Sustainability
- [ ] Recherche centrée dans header
- [ ] Icônes Account et Basket
- [ ] Header sticky mobile

### Pages
- [ ] Homepage: Hero carousel 5 slides, Tilda Products, Recipes, Blog, Instagram, Newsletter
- [ ] Product Ranges: Cercles colorés avec images
- [ ] Shop: Filtres sidebar complets, grid produits 4-5 par ligne
- [ ] Product Detail: Layout 2-column, related products
- [ ] Recipes: Hero magenta, tabs, search, cards
- [ ] Recipe Single: Layout 2-column, ingredients, instructions
- [ ] Blog: Hero orange, tabs categories, featured/popular, grid
- [ ] Blog Single: Featured image, content, related
- [ ] About: Hero overlay, description, Where to Buy
- [ ] FAQ: Hero bleu, tabs, accordion
- [ ] Contact: Hero blanc, wavy transition, form, office hours

### Responsive
- [ ] Mobile: 1 colonne, hamburger menu
- [ ] Tablet: 2 colonnes, nav inline
- [ ] Desktop: 3-4 colonnes, full layout

### Carousels
- [ ] Hero: 1 slide, arrows, dots, swipe
- [ ] Products: 4-5 desktop, infinite scroll

### JavaScript & API
- [ ] API calls mis à jour pour nouvelles structures
- [ ] Filtres produits fonctionnels
- [ ] Tabs fonctionnels partout
- [ ] Formulaires validation + soumission

### Accessibilité
- [ ] HTML sémantique
- [ ] ARIA labels
- [ ] Color contrast 4.5:1
- [ ] Keyboard navigation

### Performance
- [ ] Images lazy loading
- [ ] CSS minifié
- [ ] Scripts defer
- [ ] Lighthouse 90+

---

## 🚀 ORDRE D'EXÉCUTION RECOMMANDÉ

1. **PHASE 1** (Fondations) → Base solide
2. **PHASE 2** (Header) → Navigation visible partout
3. **PHASE 3** (Homepage) → Page principale
4. **PHASE 4-6** (Products) → E-commerce core
5. **PHASE 7-8** (Recipes) → Contenu
6. **PHASE 9-10** (Blog) → Contenu
7. **PHASE 11-13** (About, FAQ, Contact) → Pages info
8. **PHASE 14** (Footer) → Footer commun
9. **PHASE 15** (Responsive) → Mobile-first
10. **PHASE 16** (Carousels) → Interactions
11. **PHASE 17** (JS/API) → Fonctionnalités
12. **PHASE 18** (Accessibilité) → Qualité
13. **PHASE 19** (Performance) → Optimisation
14. **PHASE 20** (Testing) → Validation finale

---

## 📝 NOTES IMPORTANTES

### Backend API
- Vérifier que l'API backend (`localhost:5000`) supporte les nouveaux endpoints nécessaires
- Si non, adapter les appels API ou créer endpoints manquants

### Images
- Récupérer images Tilda (hero carousel, catégories, produits, recettes, blog)
- Optimiser toutes images (WebP, compression)
- Créer placeholders si images manquantes

### Contenu
- Traduire tous les textes en French (UI actuelle en French)
- Vérifier dates format French (`toLocaleDateString('en-EN')`)

### Compatibilité
- Conserver compatibilité avec API backend existante
- Tester avec backend réel avant déploiement

---

**FIN DU PLAN DE MIGRATION**

Ce plan couvre l'entièreté de la migration vers le design Tilda. Suivre méthodiquement chaque phase pour garantir une migration complète et fidèle au design de référence.
