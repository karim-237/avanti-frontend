document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

  const categoriesContainer = document.getElementById('blogCategories');
  const blogGrid = document.getElementById('blogGrid');

  let currentCategory = 'all';

  init();

  function init() {
    loadCategories();   // 🔹 injecte les boutons
    loadBlogPosts();   // 🔹 charge tous les blogs
  }

  // =========================
  // 1️⃣ Charger catégories → innerHTML
  // =========================
  function loadCategories() {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) return;

        renderCategories(result.data);
      })
      .catch(err => {
        console.error('Erreur chargement catégories:', err);
      });
  }

  function renderCategories(categories) {
    if (!categoriesContainer) return;

    // Bouton "Tout" en dur
    let html = `
      <button class="blog-category-tab active" data-category="all">
        Tout
      </button>
    `;

    // Boutons venant de la DB
    html += categories.map(cat => `
      <button class="blog-category-tab" data-category="${cat.slug}">
        ${cat.name}
      </button>
    `).join('');

    // 🔥 Injection directe dans ton <div id="blogCategories">
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

        if (currentCategory === 'all') {
          loadBlogPosts();
        } else {
          loadBlogPosts(currentCategory);
        }
      });
    });
  }

  // =========================
  // 3️⃣ Charger blogs filtrés
  // =========================
  function loadBlogPosts(categorySlug = null) {
    let url = `${API_BASE}/blogs`;

    if (categorySlug) {
      url += `?category=${encodeURIComponent(categorySlug)}`;
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
