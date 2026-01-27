document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';
  const categoriesContainer = document.getElementById('recipeCategories'); // div pour les catégories
  const recipesGrid = document.getElementById('recipesGrid');

  let allRecipes = [];
  let currentCategory = null;

  initCategories();
  initSearch();
  loadRecipes();

  // =============================
  // 1️⃣ Charger les catégories de recettes dynamiquement
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

    // Bouton "Toutes les recettes"
    let html = `
      <button class="blog-category-tab active" data-category="">
        Toutes les recettes
      </button>
    `;

    // Boutons dynamiques
    html += categories.map(cat => `
      <button class="blog-category-tab" data-category="${cat.slug}">
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

        const selected = this.dataset.category;
        currentCategory = selected || null;
        loadRecipes(currentCategory);
      });
    });
  }

  // =============================
  // 2️⃣ Recherche de recettes
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
  // 3️⃣ Charger recettes (par catégorie ou toutes)
  // =============================
  function loadRecipes(category = null) {
    let apiUrl = `${API_BASE}/recipes`;
    if (category) {
      apiUrl = `${API_BASE}/recipes/category/${category}`;
    }

    fetch(apiUrl)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return [];
        return res.json().catch(() => []);
      })
      .then(result => {
        let recipes = [];
        if (category && result.success && result.data?.recipes) {
          recipes = result.data.recipes; // cas filtré par catégorie
        } else if (result.success && Array.isArray(result.data)) {
          recipes = result.data; // toutes les recettes
        }

        allRecipes = recipes;
        displayRecipes(recipes);
      })
      .catch(err => {
        console.error('Erreur chargement recettes:', err);
        if (recipesGrid) {
          recipesGrid.innerHTML = '<p class="text-center">Aucune recette disponible pour le moment.</p>';
        }
      });
  }

  // =============================
  // 4️⃣ Affichage des recettes
  // =============================
  function displayRecipes(recipes) {
    if (!recipesGrid) return;

    if (!Array.isArray(recipes) || recipes.length === 0) {
      recipesGrid.innerHTML = '<p class="text-center">Aucune recette trouvée.</p>';
      return;
    }

    recipesGrid.innerHTML = recipes.map(recipe => {
      const imageUrl = recipe.image_url || recipe.image || 'assets/images/placeholder-recipe.jpg';

      return `
        <div class="recipe-card">
          <div class="recipe-card__image-wrapper">
            <img src="${imageUrl}" alt="${recipe.title || 'Recipe'}" class="recipe-card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='assets/images/placeholder-recipe.jpg';}">
            ${recipe.category ? `<div class="recipe-card__badge">${recipe.category}</div>` : ''}
          </div>
          <div class="recipe-card__body">
            <h3 class="recipe-card__title">${recipe.title || 'Recipe'}</h3>
            <p class="recipe-card__description">${recipe.short_description || recipe.description || ''}</p>
            <div class="recipe-card__actions">
              <a href="single-recipe.html?slug=${recipe.slug}" class="btn btn--secondary btn--sm">Voir la recette</a>
              ${recipe.article_slug ? `<a href="single-blog.html?slug=${recipe.article_slug}" class="recipe-card__link">Read Article</a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
});
