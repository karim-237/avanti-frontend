document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';
  const categoriesContainer = document.getElementById('recipeCategories'); 
  const recipesGrid = document.getElementById('recipesGrid');

  let allRecipes = [];
  let currentCategory = null;
  let currentTag = null;

  init();

  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get('category'),
      tag: params.get('tag')
    };
  }

  function init() {
    const { category, tag } = getQueryParams();
    currentCategory = category;
    currentTag = tag;

    initCategories();
    initSearch();
    loadRecipes(currentCategory, currentTag);
  }

  // =============================
  // 1️⃣ Charger catégories
  // =============================
  function initCategories() {
    if (!categoriesContainer) return;

    fetch(`${API_BASE}/recipes/recipe-categories`)
      .then(res => res.json())
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) return;
        renderCategories(result.data);
      })
      .catch(err => console.error('Erreur chargement catégories:', err));
  }

  function renderCategories(categories) {
    if (!categoriesContainer) return;

    let html = `<button class="blog-category-tab ${!currentCategory ? 'active' : ''}" data-category="">
      Toutes les recettes
    </button>`;

    html += categories.map(cat => `
      <button class="blog-category-tab ${currentCategory === cat.slug ? 'active' : ''}" data-category="${cat.slug}">
        ${cat.name}
      </button>
    `).join('');

    categoriesContainer.innerHTML = html;
    bindCategoryEvents();
  }

  function bindCategoryEvents() {
    const tabs = document.querySelectorAll('.blog-category-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        currentCategory = this.dataset.category || null;
        updateURL();
        loadRecipes(currentCategory, currentTag);
      });
    });
  }

  // =============================
  // 2️⃣ Recherche texte
  // =============================
  function initSearch() {
    const searchInput = document.getElementById('recipeSearchInput');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.toLowerCase().trim();

      searchTimeout = setTimeout(() => {
        if (!query) {
          displayRecipes(allRecipes);
          return;
        }

        const filtered = allRecipes.filter(recipe => {
          const title = (recipe.title || '').toLowerCase();
          const description = (recipe.description || recipe.short_description || '').toLowerCase();
          const category = (recipe.category || '').toLowerCase();
          const ingredients = (recipe.ingredients || []).join(' ').toLowerCase();
          const cuisine = (recipe.cuisine || '').toLowerCase();

          return title.includes(query) || 
                 description.includes(query) || 
                 category.includes(query) ||
                 ingredients.includes(query) ||
                 cuisine.includes(query);
        });

        displayRecipes(filtered);
      }, 300);
    });
  }

  // =============================
  // 3️⃣ Charger recettes
  // =============================
  function loadRecipes(category = null, tag = null) {
    let url = `${API_BASE}/recipes`;
    const params = [];

    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
    if (params.length) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => res.json())
      .then(result => {
        let recipes = [];
        if (result.success && Array.isArray(result.data)) {
          recipes = result.data;
        } else if (result.success && result.data?.recipes) {
          recipes = result.data.recipes;
        }

        allRecipes = recipes;
        displayRecipes(recipes);
      })
      .catch(err => {
        console.error('Erreur chargement recettes:', err);
        if (recipesGrid) recipesGrid.innerHTML = '<p class="text-center">Aucune recette disponible pour le moment.</p>';
      });
  }

  // =============================
  // 4️⃣ Affichage
  // =============================
  function displayRecipes(recipes) {
    if (!recipesGrid) return;

    if (!Array.isArray(recipes) || recipes.length === 0) {
      recipesGrid.innerHTML = '<p class="text-center">Aucune recette trouvée.</p>';
      return;
    }

    recipesGrid.innerHTML = recipes.map(recipe => {
      const imageUrl = recipe.image_url || recipe.image || '/fr/assets/images/placeholder-recipe.jpg';
      return `
        <div class="recipe-card">
          <div class="recipe-card__image-wrapper">
            <img src="${imageUrl}" alt="${recipe.title || 'Recipe'}" class="recipe-card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='/fr/assets/images/placeholder-recipe.jpg';}">
            ${recipe.category ? `<div class="recipe-card__badge">${recipe.category}</div>` : ''}
          </div>
          <div class="recipe-card__body">
            <h3 class="recipe-card__title">${recipe.title || 'Recipe'}</h3>
            <p class="recipe-card__description">${recipe.short_description || recipe.description || ''}</p>
            <div class="recipe-card__actions">
              <a href="single-recipe.html?slug=${recipe.slug}" class="btn btn--secondary btn--sm">Voir la recette</a>
              ${recipe.article_slug ? `<a href="single-recipe.html?slug=${recipe.article_slug}" class="recipe-card__link">Read Article</a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =============================
  // 🔗 Mise à jour URL
  // =============================
  function updateURL() {
    const params = new URLSearchParams();
    if (currentCategory) params.set('category', currentCategory);
    if (currentTag) params.set('tag', currentTag);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  }
});
