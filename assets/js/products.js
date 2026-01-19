

document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');

  initCategoryRanges();
  initTabSelector();

  function initCategoryRanges() {
    fetch(`${API_BASE}/product-categories`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return [];
        return res.json().catch(() => []);
      })
      .then(categories => {
        const grid = document.getElementById('categoryRangesGrid');
        if (!grid) return;

        if (!Array.isArray(categories) || categories.length === 0) {
          grid.innerHTML = '<p>Aucune catégorie disponible.</p>';
          return;
        }

        const categoryColors = {
          'microwave-rice': 'microwave',
          'dry-rice': 'dry',
          'jasmine-rice': 'jasmine',
          'boil-in-bag': 'boil-bag',
          'bundles': 'bundles',
          'kids': 'kids'
        };

        grid.innerHTML = categories.map(cat => {
          const slug = cat.slug || '';
          const colorClass = Object.keys(categoryColors).find(key => slug.includes(key)) 
            ? `category-circle--${categoryColors[Object.keys(categoryColors).find(key => slug.includes(key))]}`
            : 'category-circle--dry';
          
          return `
            <a href="products.html?view=shop&category=${cat.slug}" class="category-circle ${colorClass}" 
               style="background-image: url(${cat.image_path || 'assets/images/placeholder-category.jpg'})">
              <div class="category-circle__content">
                <h3 class="category-circle__title">${cat.name}</h3>
              </div>
            </a>
          `;
        }).join('');
      })
      .catch(err => console.error('Error loading categories:', err));
  }

  function initTabSelector() {
    const tabs = document.querySelectorAll('.tab-selector__button');
    const shopSection = document.getElementById('shopSection');
    const categoryRanges = document.getElementById('categoryRanges');
    const allProductsGrid = document.getElementById('allProductsGrid');

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const tabType = this.getAttribute('data-tab');
        
        if (tabType === 'shop') {
          if (categoryRanges) categoryRanges.style.display = 'none';
          if (shopSection) shopSection.style.display = 'block';
          window.location.hash = 'shop';
          initShopProducts();
        } else {
          if (categoryRanges) categoryRanges.style.display = 'block';
          if (shopSection) shopSection.style.display = 'none';
          window.location.hash = '';
          if (tabType === 'all-products') {
            initAllProducts();
          }
        }
      });
    });

    if (view === 'shop' || window.location.hash === '#shop') {
      const shopTab = document.querySelector('[data-tab="shop"]');
      if (shopTab) shopTab.click();
    } else {
      initAllProducts();
    }
  }

  function initAllProducts() {
    fetch(`${API_BASE}/products`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          console.warn('API returned HTML instead of JSON');
          return { success: false, data: [] };
        }
        return res.json().catch(() => {
          console.warn('Failed to parse JSON response');
          return { success: false, data: [] };
        });
      })
      .then(result => {
        const products = (result.success && Array.isArray(result.data)) ? result.data : (Array.isArray(result) ? result : []);
        const grid = document.getElementById('categoryRangesGrid');
        
        if (!grid) return;

        if (products.length === 0) {
          grid.innerHTML = '<p class="text-center">Aucun produit disponible.</p>';
          return;
        }

        grid.innerHTML = products.map(product => {
          const discount = product.original_price && product.price < product.original_price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : null;
          
          return `
            <div class="card" data-product-id="${product.id || product.slug}">
              <div style="position: relative;">
                <img src="${product.image_path || 'assets/images/placeholder-product.jpg'}" alt="${product.name || 'Product'}" class="card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
                ${discount ? `<span style="position: absolute; top: 12px; right: 12px; background-color: var(--color-accent, #FFC107); color: var(--color-black, #000); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">-${discount}%</span>` : ''}
              </div>
              <div class="card__body">
                <span style="display: inline-block; font-size: 12px; color: var(--color-text-light, #666); margin-bottom: 8px;">${product.category || 'Produit'}</span>
                <h4 class="card__title">${product.name || 'Product'}</h4>
                <p class="card__text">${product.short_description || (product.description ? product.description.substring(0, 100) + '...' : '')}</p>
                <div class="price">
                  ${product.original_price && product.price < product.original_price ? 
                    `<span class="price-old">${product.original_price.toFixed(2)}XFA</span>` : ''}
                  <span class="price-new">${(product.price || 0).toFixed(2)}XFA</span>
                </div>
                <div style="display: flex; gap: 8px; margin-top: auto;">
                  <a href="product-detail.html?slug=${product.slug || ''}" class="btn btn--primary btn--sm" style="flex: 1;">Voir le produit</a>
                  <button onclick="addToCart('${product.slug || ''}')" class="btn btn--primary btn--sm" style="background-color: var(--color-accent, #FFC107); color: var(--color-black, #000); border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                    <i class="fa-solid fa-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        const categoryRanges = document.getElementById('categoryRanges');
        if (categoryRanges) {
          categoryRanges.classList.add('category-ranges--products-grid');
          const grid = document.getElementById('categoryRangesGrid');
          if (grid) {
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            grid.style.gap = 'var(--spacing-lg)';
          }
        }
      })
      .catch(err => console.error('Error loading all products:', err));
  }

  function initShopProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    let apiUrl = `${API_BASE}/products`;
    if (category) {
      apiUrl += `?category=${category}`;
    }

    fetch(apiUrl)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          console.warn('API returned HTML instead of JSON');
          return { success: false, data: [] };
        }
        return res.json().catch(() => {
          console.warn('Failed to parse JSON response');
          return { success: false, data: [] };
        });
      })
      .then(result => {
        const products = (result.success && Array.isArray(result.data)) ? result.data : (Array.isArray(result) ? result : []);
        const grid = document.getElementById('productsGrid');
        const count = document.getElementById('productsCount');
        
        if (!grid) return;

        if (products.length === 0) {
          grid.innerHTML = '<p class="text-center">Aucun produit disponible.</p>';
          if (count) count.textContent = '0 produits trouvés';
          return;
        }

        grid.innerHTML = products.map(product => {
          const discount = product.original_price && product.price < product.original_price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : null;
          
          return `
            <div class="card" data-product-id="${product.id || product.slug}">
              <div style="position: relative;">
                <img src="${product.image_path || 'assets/images/placeholder-product.jpg'}" alt="${product.name || 'Product'}" class="card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
                ${discount ? `<span style="position: absolute; top: 12px; right: 12px; background-color: var(--color-accent, #FFC107); color: var(--color-black, #000); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">-${discount}%</span>` : ''}
              </div>
              <div class="card__body">
                <span style="display: inline-block; font-size: 12px; color: var(--color-text-light, #666); margin-bottom: 8px;">${product.category || 'Produit'}</span>
                <h4 class="card__title">${product.name || 'Product'}</h4>
                <p class="card__text">${product.short_description || (product.description ? product.description.substring(0, 100) + '...' : '')}</p>
                <div class="price">
                  ${product.original_price && product.price < product.original_price ? 
                    `<span class="price-old">${product.original_price.toFixed(2)}XFA</span>` : ''}
                  <span class="price-new">${(product.price || 0).toFixed(2)}XFA</span>
                </div>
                <div style="display: flex; gap: 8px; margin-top: auto;">
                  <a href="product-detail.html?slug=${product.slug || ''}" class="btn btn--primary btn--sm" style="flex: 1;">Voir le produit</a>
                  <button onclick="addToCart('${product.slug || ''}')" class="btn btn--primary btn--sm" style="background-color: var(--color-accent, #FFC107); color: var(--color-black, #000); border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                    <i class="fa-solid fa-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        if (count) count.textContent = `${products.length} produit${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}`;
      })
      .catch(err => console.error('Error loading shop products:', err));
  }

  function initFilters() {
    const categoryCards = document.querySelectorAll('.filter-category-card');
    const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    const clearBtn = document.getElementById('clearFiltersBtn');

    categoryCards.forEach(card => {
      card.addEventListener('click', function() {
        categoryCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        applyFilters();
      });
    });

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', applyFilters);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        checkboxes.forEach(cb => cb.checked = false);
        categoryCards.forEach(c => c.classList.remove('active'));
        const allCard = document.querySelector('[data-category="all"]');
        if (allCard) allCard.classList.add('active');
        applyFilters();
      });
    }
  }

  function applyFilters() {
    const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value);
    const selectedDietary = Array.from(document.querySelectorAll('input[name="dietary"]:checked')).map(cb => cb.value);
    const selectedFlavour = Array.from(document.querySelectorAll('input[name="flavour"]:checked')).map(cb => cb.value);
    const selectedCuisine = Array.from(document.querySelectorAll('input[name="cuisine"]:checked')).map(cb => cb.value);
    const activeCategory = document.querySelector('.filter-category-card.active')?.getAttribute('data-category');

    const productCards = document.querySelectorAll('.product-card-shop');
    let visibleCount = 0;

    productCards.forEach(card => {
      const productId = card.getAttribute('data-product-id');
      let visible = true;

      if (activeCategory && activeCategory !== 'all') {
        // Filter by category logic here
      }

      if (selectedTypes.length > 0) {
        // Filter by type logic here
      }

      if (selectedDietary.length > 0) {
        // Filter by dietary logic here
      }

      if (selectedFlavour.length > 0) {
        // Filter by flavour logic here
      }

      if (selectedCuisine.length > 0) {
        // Filter by cuisine logic here
      }

      card.style.display = visible ? 'flex' : 'none';
      if (visible) visibleCount++;
    });

    const count = document.getElementById('productsCount');
    if (count) count.textContent = `${visibleCount} produit${visibleCount > 1 ? 's' : ''} trouvé${visibleCount > 1 ? 's' : ''}`;
  }

  initFilters();
});

function addToCart(slug) {
  console.log('Add to cart:', slug);
  // Cart functionality to be implemented
}
