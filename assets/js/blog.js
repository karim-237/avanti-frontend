document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

  const categoriesContainer = document.getElementById('blogCategories');
  const blogGrid = document.getElementById('blogGrid');

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

    loadCategories(category);          // injecte les boutons + active la bonne catégorie
    loadBlogPosts(category, tag);      // charge les blogs filtrés dès le départ
  }

  // =========================
  // 1️⃣ Charger catégories → innerHTML
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
  // 3️⃣ Charger blogs filtrés (catégorie + tag)
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
  // 4️⃣ Affichage grid
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
