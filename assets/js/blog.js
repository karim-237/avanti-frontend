document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

  const categoriesContainer = document.getElementById('blogCategories');
  const blogGrid = document.getElementById('blogGrid');
  const blogFeaturedGrid = document.getElementById('blogFeaturedGrid');

  let currentCategory = 'all';

  init();

  // =========================
  // 🔎 Lire params URL
  // =========================
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get('category'),
      tag: params.get('tag')
    };
  }

  function init() {
    const { category, tag } = getQueryParams();

    loadCategories(category);          
    loadBlogPosts(category, tag);      
    loadFeaturedBlogs();               // 🔥 NOUVEAU : blogs featured
  }

  // =========================
  // 1️⃣ Charger catégories
  // =========================
  function loadCategories(activeCategory = null) {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) return;

        renderCategories(result.data, activeCategory);
      })
      .catch(err => {
        console.error('Erreur chargement catégories:', err);
      });
  }

  function renderCategories(categories, activeCategory = null) {
    if (!categoriesContainer) return;

    let html = `
      <button class="blog-category-tab ${!activeCategory ? 'active' : ''}" data-category="all">
        Tout
      </button>
    `;

    html += categories.map(cat => `
      <button class="blog-category-tab ${activeCategory === cat.slug ? 'active' : ''}" data-category="${cat.slug}">
        ${cat.name}
      </button>
    `).join('');

    categoriesContainer.innerHTML = html;

    bindCategoryEvents();
  }

  // =========================
  // 2️⃣ Clic sur catégorie
  // =========================
  function bindCategoryEvents() {
    const tabs = document.querySelectorAll('.blog-category-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        currentCategory = this.dataset.category;

        const { tag } = getQueryParams();

        updateURL(currentCategory, tag);

        loadBlogPosts(
          currentCategory === 'all' ? null : currentCategory,
          tag
        );
      });
    });
  }

  // =========================
  // 3️⃣ Charger blogs filtrés
  // =========================
  function loadBlogPosts(categorySlug = null, tagSlug = null) {
    let url = `${API_BASE}/blogs`;
    const params = [];

    if (categorySlug && categorySlug !== 'all') {
      params.push(`category=${encodeURIComponent(categorySlug)}`);
    }

    if (tagSlug) {
      params.push(`tag=${encodeURIComponent(tagSlug)}`);
    }

    if (params.length) {
      url += `?${params.join('&')}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(result => {
        const posts = (result.success && Array.isArray(result.data))
          ? result.data
          : [];

        displayPosts(posts);
      })
      .catch(err => {
        console.error('Erreur chargement blogs:', err);
        if (blogGrid) {
          blogGrid.innerHTML = '<p class="text-center">Aucun article trouvé.</p>';
        }
      });
  }

// =========================
// ⭐ Charger blogs FEATURED
// =========================
function loadFeaturedBlogs() {
  if (!blogFeaturedGrid) return;

  const url = `${API_BASE}/blogs?featured=true`;

  fetch(url)
    .then(res => res.json())
    .then(result => {
      let posts = (result.success && Array.isArray(result.data))
        ? result.data
        : [];

      // 🔥 Fallback : filtre côté front si l’API renvoie tout
      posts = posts.filter(p =>
        p.featured === true ||
        p.featured === 1 ||
        p.featured === "true"
      );

      displayFeaturedPosts(posts);
    })
    .catch(err => {
      console.error('Erreur chargement featured blogs:', err);
      blogFeaturedGrid.innerHTML = '';
    });
}


 // =========================
// ⭐ Affichage FEATURED
// =========================
function displayFeaturedPosts(posts) {
  if (!blogFeaturedGrid) return;

  if (!Array.isArray(posts) || posts.length === 0) {
    blogFeaturedGrid.innerHTML = '';
    return;
  }

  blogFeaturedGrid.innerHTML = posts.map(post => {
    const imageUrl =
      post.image_url ||
      post.single_image ||
      post.single_image_xl ||
      'assets/images/placeholder-blog.jpg';

    return `
      <article class="blog-featured-card">
        <a href="single-blog.html?slug=${post.slug}" class="blog-featured-card__link">
          <div class="blog-featured-card__image-wrapper">
            <img src="${imageUrl}" alt="${post.title || 'Blog post'}" loading="lazy">
          </div>
          <div class="blog-featured-card__body">
            ${post.category_name ? `<div class="blog-featured-card__category">${post.category_name}</div>` : ''}
            <h3 class="blog-featured-card__title">${post.title || 'Article'}</h3>
            <div class="blog-featured-card__date">
              ${new Date(post.publish_date).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </a>
      </article>
    `;
  }).join('');
}


  // =========================
  // 🔗 Mettre à jour l’URL
  // =========================
  function updateURL(category, tag) {
    const params = new URLSearchParams();

    if (category && category !== 'all') {
      params.set('category', category);
    }

    if (tag) {
      params.set('tag', tag);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  }

  // =========================
  // 4️⃣ Affichage grid NORMAL
  // =========================
  function displayPosts(posts) {
    if (!blogGrid) return;

    if (!Array.isArray(posts) || posts.length === 0) {
      blogGrid.innerHTML = '<p class="text-center">Aucun article trouvé.</p>';
      return;
    }

    blogGrid.innerHTML = posts.map(post => {
      const imageUrl =
        post.image_url ||
        post.single_image ||
        post.single_image_xl ||
        'assets/images/placeholder-blog.jpg';

      return `
        <article class="blog-card">
          <div class="blog-card__image-wrapper">
            <img src="${imageUrl}" alt="${post.title || 'Blog post'}" class="blog-card__image" loading="lazy">
            ${post.category_name ? `<div class="blog-card__category">${post.category_name}</div>` : ''}
          </div>
          <div class="blog-card__body">
            <div class="blog-card__date">
              ${new Date(post.publish_date).toLocaleDateString('fr-FR')}
            </div>
            <h3 class="blog-card__title">${post.title || 'Article'}</h3>
            <p class="blog-card__description">
              ${post.short_description || ''}
            </p>
            <a href="single-blog.html?slug=${post.slug}" class="btn btn--primary btn--sm">
              Lire l'article →
            </a>
          </div>
        </article>
      `;
    }).join('');
  }
});
