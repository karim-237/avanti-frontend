/* =====================================================
   UTIL
===================================================== */
function truncateText(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

  const categoryRanges = document.getElementById('categoryRanges');
  const categoryRangesGrid = document.getElementById('categoryRangesGrid');
  const tabs = document.querySelectorAll('.tab-selector__button');

  /* =====================================================
     PARAMÈTRES URL
  ===================================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get('category');

  /* =====================================================
     ÉTAT INITIAL
     👉 TOUJOURS le même affichage (cards)
     👉 La catégorie ne change QUE la requête API
  ===================================================== */
  if (categoryRanges) categoryRanges.style.display = 'block';

  setActiveTab('all');

  loadProducts(categoryRangesGrid, null, selectedCategory);

  // SEO basique
  if (selectedCategory) {
    document.title = `Produits ${selectedCategory.replace(/-/g, ' ')} | Avanti Cameroun`;
  }

  /* =====================================================
     GESTION DES TABS
     (inchangé visuellement)
  ===================================================== */
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const tabType = this.getAttribute('data-tab');

      // Pour l’instant, même comportement
      // (tu pourras différencier plus tard si besoin)
      if (tabType === 'all') {
        loadProducts(categoryRangesGrid);
      }
    });
  });

  /* =====================================================
     Loading DES PRODUITS
  ===================================================== */
  function loadProducts(targetGrid, counterEl = null, category = null) {
    if (!targetGrid) return;

    targetGrid.innerHTML = '<p style="text-align:center;">Loading products...</p>';

    let url = `${API_BASE}/products/en`;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Réponse API invalide');
        return res.json();
      })
      .then(result => {
        const products = result.success && Array.isArray(result.data)
          ? result.data
          : [];

        if (products.length === 0) {
          targetGrid.innerHTML = '<p style="text-align:center;">No products available.</p>';
          return;
        }

        renderProducts(targetGrid, products);

        if (counterEl) {
          counterEl.textContent = `${products.length} produit${products.length > 1 ? 's' : ''}`;
        }
      })
      .catch(err => {
        console.error(err);
        targetGrid.innerHTML = '<p style="text-align:center;">Product loading error.</p>';
      });
  }

  /* =====================================================
     RENDER PRODUITS (INCHANGÉ)
  ===================================================== */
  function renderProducts(targetGrid, products) {
    targetGrid.innerHTML = products.map(product => {
      const discount =
        product.original_price && product.price < product.original_price
          ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
          : null;

      return `
        <div class="card">
          <div style="position: relative;">
            <img 
              src="${product.image_path || '/fr/assets/images/placeholder-product.jpg'}"
              alt="${product.name || 'Product'}"
              class="card__image"
              loading="lazy"
              onerror="this.src='/fr/assets/images/placeholder-product.jpg'"
            >
            ${discount ? `
              <span style="
                position:absolute;
                top:12px;
                right:12px;
                background:#FFC107;
                color:#000;
                padding:4px 8px;
                font-size:12px;
                font-weight:bold;
                border-radius:4px;
              ">
                -${discount}%
              </span>` : ''}
          </div>
          <div class="card__body">
            <h4 class="card__title">${product.name || 'Product'}</h4>
            <p class="card__text">
              ${truncateText(
                product.short_description || product.description || '',
                120
              )}
            </p>
            <div class="price">
              ${product.original_price && product.price < product.original_price
                ? `<span class="price-old"></span>`
                : ''}
              <span class="price-new"></span>
            </div>
            <div style="display:flex; gap:8px; margin-top:auto;">
              <a href="/en/product-detail.html?slug=${product.slug || ''}" class="btn btn--primary btn--sm" style="margin-top: auto;">See the product</a> 
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* =====================================================
     ONGLET ACTIF
  ===================================================== */
  function setActiveTab(type) {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${type}"]`)?.classList.add('active');
  }
});

/* =====================================================
   PANIER (placeholder)
===================================================== */
function addToCart(slug) {
  console.log('Add to cart:', slug);
}
