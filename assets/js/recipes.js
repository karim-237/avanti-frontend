

document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';
  let allRecipes = [];
  let currentCategory = null;

  initTabs();
  initSearch();
  loadRecipes();

  function initTabs() {
    const tabs = document.querySelectorAll('.recipes-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const tabType = this.getAttribute('data-tab');
        
        if (tabType === 'meal-planner') {
          document.getElementById('recipesGrid').innerHTML = '<p class="text-center">Meal Planner feature coming soon...</p>';
        } else {
          loadRecipes(currentCategory);
        }
      });
    });
  }

  function initSearch() {
    const searchInput = document.getElementById('recipeSearchInput');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.toLowerCase().trim();
      
      searchTimeout = setTimeout(() => {
        if (query.length === 0) {
          displayRecipes(allRecipes);
        } else {
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
        }
      }, 300);
    });
  }

  function loadRecipes(category = null) {
    let apiUrl = `${API_BASE}/recipes`;
    if (category) {
      apiUrl += `?category=${category}`;
    }

    fetch(apiUrl)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return [];
        return res.json().catch(() => []);
      })
      .then(result => {
        const recipes = (result.success && Array.isArray(result.data)) 
          ? result.data 
          : (Array.isArray(result) ? result : []);
        
        allRecipes = recipes;
        displayRecipes(recipes);
      })
      .catch(err => {
        console.error('Error loading recipes:', err);
        const grid = document.getElementById('recipesGrid');
        if (grid) {
          grid.innerHTML = '<p class="text-center">Aucune recette disponible pour le moment.</p>';
        }
      });
  }

  function displayRecipes(recipes) {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;

    if (recipes.length === 0) {
      grid.innerHTML = '<p class="text-center">Aucune recette trouvée.</p>';
      return;
    }

    grid.innerHTML = recipes.map(recipe => {
      const imageUrl = recipe.image_url || recipe.image || recipe.image_path || 'assets/images/placeholder-recipe.jpg';
      return `
      <div class="recipe-card">
        <div class="recipe-card__image-wrapper">
          <img src="${imageUrl}" alt="${recipe.title || 'Recipe'}" class="recipe-card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
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
