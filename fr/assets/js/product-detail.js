


document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    console.error('No product slug provided');
    return;
  }

  loadProductDetail(slug);
  loadRelatedProducts(slug);

  function loadProductDetail(slug) {
    fetch(`${API_BASE}/products/slug?slug=${slug}`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          return null;
        }
        return res.json().catch(() => null);
      })
      .then(result => {
        if (!result) {
          console.error('Product not found');
          return;
        }

        // ✅ Corrigé : prendre le premier élément du tableau data
        const product = result.success && Array.isArray(result.data) && result.data.length > 0
          ? result.data[0]
          : null;

        if (!product) {
          console.error('Product not found in data array');
          return;
        }

        document.getElementById('productBreadcrumbName').textContent = product.name || 'PRODUIT';
        document.getElementById('productTitle').textContent = product.name || '';
        document.getElementById('productCategoryBadge').textContent = product.category || 'Produit';
        
        const imageWrapper = document.getElementById('productImageWrapper');
        if (product.category) {
          const categoryColors = {
            'microwave-rice': '#E91E63',
            'dry-rice': '#00BFA5',
            'jasmine-rice': '#FFC107'
          };
          const bgColor = categoryColors[product.category.toLowerCase().replace(/\s+/g, '-')] || '#F5F5F5';
          imageWrapper.style.backgroundColor = bgColor;
        }

        const mainImage = document.getElementById('productMainImage'); 
        if (mainImage && product.image_path) {
          mainImage.src = product.image_path;
          mainImage.alt = product.name || 'Product image';
          mainImage.onerror = function() {
            this.src = '/fr/assets/images/placeholder-product.jpg';
            this.alt = 'Image non disponible';
          };
        }

        const badges = document.getElementById('productBadges');
        if (badges && product.dietary) {
          badges.innerHTML = product.dietary.map(diet => {
            const icons = {
              'vegan': 'fa-leaf',
              'vegetarian': 'fa-carrot',
              'gluten-free': 'fa-wheat-awn'
            };
            return `
              <div class="product-badge">
                <i class="fa-solid ${icons[diet.toLowerCase()] || 'fa-check'} product-badge__icon"></i>
                <span>${diet}</span>
              </div>
            `;
          }).join('');
        }

        const ratingText = document.getElementById('ratingText');
        if (ratingText && product.rating) {
          ratingText.textContent = `(${product.rating}/5)`;
        }

        const priceOld = document.getElementById('productPriceOld');
        const priceNew = document.getElementById('productPriceNew');
        if (product.original_price && product.price < product.original_price) {
          priceOld.textContent = ``;
          priceOld.style.display = 'inline';
        } else {
          priceOld.style.display = 'none';
        }
        priceNew.textContent = ``;

        const nutritionalTable = document.getElementById('nutritionalTable');
        if (nutritionalTable && product.nutritional) {
          nutritionalTable.innerHTML = Object.entries(product.nutritional).map(([key, value]) => `
            <tr>
              <td>${key}</td>
              <td>${value}</td>
            </tr>
          `).join('');
        }

        const description = document.getElementById('productDescription');
        if (description && product.description) {
          description.textContent = product.description;
        }
      })
      .catch(err => console.error('Error loading product detail:', err));
  }

  function loadRelatedProducts(currentSlug) {
    fetch(`${API_BASE}/products?limit=4`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return [];
        return res.json().catch(() => []);
      })
      .then(result => {
        const products = (result.success && Array.isArray(result.data)) 
          ? result.data.filter(p => p.slug !== currentSlug).slice(0, 4)
          : (Array.isArray(result) ? result.filter(p => p.slug !== currentSlug).slice(0, 4) : []);
        
        const list = document.getElementById('relatedProductsList');
        if (!list) return;

        if (products.length === 0) {
          list.innerHTML = '<p>Aucun produit similaire disponible.</p>';
          return;
        }

        list.innerHTML = products.map(product => `
          <li class="splide__slide">
            <div class="card">
              <img src="${product.image_path || '/fr/assets/images/placeholder-product.jpg'}" alt="${product.name || 'Product'}" class="card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
              <div class="card__body">
                <h4 class="card__title">${product.name || 'Product'}</h4>
                <div class="price">
                  ${product.original_price && product.price < product.original_price 
                    ? `<span class="price-old"></span>` : ''}
                  <span class="price-new"></span>
                </div>
                <a href="product-detail.html?slug=${product.slug || ''}" class="btn btn--primary btn--sm">Voir</a>
              </div>
            </div>
          </li>
        `).join('');

        if (typeof Splide !== 'undefined') {
          new Splide('#relatedProductsCarousel', {
            type: 'loop',
            perPage: 4,
            gap: '1.5rem',
            pagination: false,
            arrows: true,
            breakpoints: {
              1024: { perPage: 3 },
              768: { perPage: 2 },
              640: { perPage: 1 }
            }
          }).mount();
        }
      })
      .catch(err => console.error('Error loading related products:', err));
  }
});

function addToCartFromDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  console.log('Add to cart:', slug);
}

function saveOrPrintRecipe() {
  window.print();
}
