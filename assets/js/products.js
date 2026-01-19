function truncateText(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}


document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

  const categoryRanges = document.getElementById('categoryRanges');
  const categoryRangesGrid = document.getElementById('categoryRangesGrid');
  const shopSection = document.getElementById('shopSection');
  const productsGrid = document.getElementById('productsGrid');
  const productsCount = document.getElementById('productsCount');
  const tabs = document.querySelectorAll('.tab-selector__button');

  /* =====================================================
     ÉTAT INITIAL — afficher TOUS les produits directement
  ===================================================== */
  if (categoryRanges) categoryRanges.style.display = 'block';
  if (shopSection) shopSection.style.display = 'none';

  loadAllProducts(categoryRangesGrid);

  /* =====================================================
     GESTION DES TABS (All Products / Shop)
  ===================================================== */
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const tabType = this.getAttribute('data-tab');

      if (tabType === 'shop') {
        if (categoryRanges) categoryRanges.style.display = 'none';
        if (shopSection) shopSection.style.display = 'block';
        loadAllProducts(productsGrid, productsCount);
      } else {
        if (categoryRanges) categoryRanges.style.display = 'block';
        if (shopSection) shopSection.style.display = 'none';
        loadAllProducts(categoryRangesGrid);
      }
    });
  });

  /* =====================================================
     CHARGEMENT DES PRODUITS
  ===================================================== */
  function loadAllProducts(targetGrid, counterEl = null) {
    if (!targetGrid) return;

    targetGrid.innerHTML = '<p style="text-align:center;">Chargement des produits...</p>';

    fetch(`${API_BASE}/products`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          throw new Error('Réponse API invalide');
        }
        return res.json();
      })
      .then(result => {
        const products = (result.success && Array.isArray(result.data))
          ? result.data
          : [];

        if (products.length === 0) {
          targetGrid.innerHTML = '<p style="text-align:center;">Aucun produit disponible.</p>';
          if (counterEl) counterEl.textContent = '0 produit';
          return;
        }

        targetGrid.innerHTML = products.map(product => {
          const discount = product.original_price && product.price < product.original_price
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : null;

          return `
            <div class="card">
              <div style="position: relative;">
                <img 
                  src="${product.image_path || 'assets/images/placeholder-product.jpg'}"
                  alt="${product.name || 'Produit'}"
                  class="card__image"
                  loading="lazy"
                  onerror="this.src='assets/images/placeholder-product.jpg'"
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
                <h4 class="card__title">${product.name || 'Produit'}</h4>
              <p class="card__text">
               ${truncateText(
                 product.short_description || product.description || '',
                 120
                )}
              </p>
                <div class="price">
                  ${product.original_price && product.price < product.original_price
              ? `<span class="price-old">${product.original_price} XFA</span>`
              : ''}
                  <span class="price-new">${product.price || 0} XFA</span>
                </div>
                <div style="display:flex; gap:8px; margin-top:auto;">
                  <a href="product-detail.html?slug=${product.slug}" class="btn btn--primary btn--sm">
                    Voir le produit
                  </a>
                  <button onclick="addToCart('${product.slug}')" class="btn btn--primary btn--sm">
                    <i class="fa-solid fa-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        if (counterEl) {
          counterEl.textContent = `${products.length} produit${products.length > 1 ? 's' : ''}`;
        }
      })
      .catch(err => {
        console.error(err);
        targetGrid.innerHTML = '<p style="text-align:center;">Erreur de chargement des produits.</p>';
      });
  }
});

/* =====================================================
   PANIER (placeholder)
===================================================== */
function addToCart(slug) {
  console.log('Add to cart:', slug);
}
