


document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

  initHeroCarousel();
  initTildaProducts();
  initRecipes();
  initBlog();
  initInstagram();
  initNewsletter();

  function initHeroCarousel() {
    fetch(`${API_BASE}/home-banners`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          return [];
        }
        return res.json();
      })
      .then(banners => {
        
        const list = document.getElementById('heroCarouselList');
        if (!list) return;
        
        if (!Array.isArray(banners) || banners.length === 0) {
          list.innerHTML = '<li class="splide__slide"><div class="hero-carousel__slide" style="background: linear-gradient(135deg, #2C3E50 0%, #3C5189 100%);"><div class="hero-carousel__overlay"></div><div class="hero-carousel__content"><h1 class="hero-carousel__title">Bienvenue</h1><p class="hero-carousel__text">Découvrez notre sélection de riz de qualité</p></div></div></li>';
          if (typeof Splide !== 'undefined') {
            new Splide('#heroCarousel', { type: 'loop', perPage: 1, pagination: true, arrows: true }).mount();
          }
          return;
        }

        list.innerHTML = banners.map(banner => `
          <li class="splide__slide">
            <div class="hero-carousel__slide" style="background-image: url(${banner.image_path})">
              <div class="hero-carousel__overlay"></div>
              <div class="hero-carousel__content">
                <h1 class="hero-carousel__title">${banner.title || ''}</h1>
                <p class="hero-carousel__text">${banner.description || ''}</p>
                ${banner.cta_link ? `<a href="${banner.cta_link}" class="btn btn--primary">${banner.cta_text || 'En savoir plus'}</a>` : ''}
              </div>
            </div>
          </li>
        `).join('');

        if (typeof Splide !== 'undefined') {
          new Splide('#heroCarousel', {
            type: 'loop',
            perPage: 1,
            autoplay: false,
            interval: 5000,
            pagination: true,
            arrows: true,
            speed: 500,
            easing: 'ease-in-out'
          }).mount();
        }
      })
      .catch(err => console.error('Error loading hero banners:', err));
  }

    function initTildaProducts() {
    Promise.all([
      fetch(`${API_BASE}/product-categories`).then(r => {
        if (!r.ok || r.headers.get('content-type')?.includes('text/html')) return { data: [] };
        return r.json().catch(() => ({ data: [] }));
      }),
      fetch(`${API_BASE}/products?featured=true&limit=8`).then(r => {
        if (!r.ok || r.headers.get('content-type')?.includes('text/html')) return { data: [] };
        return r.json().catch(() => ({ data: [] }));
      })
    ]).then(([categoriesRes, productsRes]) => {
      const categories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.data || []);
      const products = Array.isArray(productsRes) ? productsRes : (productsRes?.data || []);
      
      // 1. Remplissage des catégories
      const categoryGrid = document.getElementById('categoryGrid');
      if (categoryGrid && categories.length > 0) {
          categoryGrid.innerHTML = categories.slice(0, 4).map(cat => {
            const imageUrl = cat.image_path || cat.image_url || cat.category_image || '';
            const fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3ERiz%3C/text%3E%3C/svg%3E';
            return `
            <a href="/fr/products.html?category=${cat.slug || ''}" class="category-card">
              <div class="category-card__image-wrapper">
                <img src="${imageUrl || fallbackSvg}" alt="${cat.name || 'Category'}" class="category-card__image" loading="lazy">
              </div>
              <h3 class="category-card__title">${cat.name || 'Category'}</h3>
            </a>`;
          }).join('');
      }

      // 2. Remplissage des produits
      const productsList = document.getElementById('productsCarouselList');
      if (productsList) {
        if (products.length === 0) {
          productsList.innerHTML = '<li class="splide__slide"><p class="text-center">Aucun produit disponible.</p></li>';
          return;
        }

        productsList.innerHTML = products.map(product => {
          const discount = product.original_price && product.price < product.original_price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null;
          
          return `
          <li class="splide__slide">
            <div class="card">
              <img src="${product.image_path || '/fr/assets/images/placeholder-product.jpg'}" alt="${product.name}" class="card__image">
              <div class="card__body">
                <h4 class="card__title">${product.name}</h4>
                <div class="price"><span class="price-new">${product.price} FCFA</span></div>
                <a href="/fr/product-detail.html?slug=${product.slug}" class="btn btn--primary btn--sm">Voir le produit</a> 
              </div>
            </div>
          </li>`;
        }).join('');

        // --- CORRECTION SPLIDE ICI ---
        // On utilise un setTimeout pour laisser au navigateur le temps d'injecter le HTML
        setTimeout(() => {
          const carouselContainer = document.querySelector('#productsCarousel');
          // On vérifie que Splide existe ET que la structure HTML (track) est présente
          if (typeof Splide !== 'undefined' && carouselContainer && carouselContainer.querySelector('.splide__track')) {
            new Splide('#productsCarousel', {
              type: 'loop',
              perPage: 4,
              perMove: 1,
              gap: '1.5rem',
              pagination: false,
              arrows: true,
              breakpoints: {
                1024: { perPage: 3 },
                768: { perPage: 2 },
                640: { perPage: 1 }
              }
            }).mount();
          } else {
            console.warn("[Splide] Structure non trouvée pour #productsCarousel");
          }
        }, 50); 
      }
    }).catch(err => console.error('Error loading products:', err));
  }


  function initRecipes() {
    fetch(`${API_BASE}/recipes?featured=true&limit=3`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return { data: [] };
        return res.json().catch(() => ({ data: [] }));
      })
      .then(recipesRes => {
        const grid = document.getElementById('recipeGrid');
        if (!grid) return;
        
        const recipes = Array.isArray(recipesRes) ? recipesRes : (recipesRes?.data || []);
        if (!Array.isArray(recipes) || recipes.length === 0) {
          grid.innerHTML = '<p>Aucune recette disponible pour le moment.</p>';
          return;
        }

        grid.innerHTML = recipes.map(recipe => {
          const imageUrl = recipe.image_url || recipe.image || recipe.image_path || '/fr/assets/images/placeholder-recipe.jpg';
          return `
          <div class="recipe-card">
            <img src="${imageUrl}" alt="${recipe.title || 'Recipe'}" class="recipe-card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
            <div class="recipe-card__body">
              <span class="recipe-card__badge">${recipe.category || 'Recette'}</span>
              <h3 class="recipe-card__title">${recipe.title || 'Recipe'}</h3>
              <p class="recipe-card__text">${recipe.short_description || ''}</p>
              <a href="/fr/single-recipe.html?slug=${recipe.slug || ''}" class="btn btn--secondary btn--sm">Voir la recette</a>
            </div>
          </div>
        `;
        }).join('');
      })
      .catch(err => console.error('Error loading recipes:', err));
  }

  function initBlog() {
    fetch(`${API_BASE}/blogs?featured=true&limit=3`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return { data: [] };
        return res.json().catch(() => ({ data: [] }));
      })
      .then(postsRes => {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;
        
        const posts = Array.isArray(postsRes) ? postsRes : (postsRes?.data || []);
        if (!Array.isArray(posts) || posts.length === 0) {
          grid.innerHTML = '<p>Aucun article disponible pour le moment.</p>';
          return;
        }

        grid.innerHTML = posts.map(post => {
          const imageUrl = post.image_url || post.image_path || post.single_image || '/fr/assets/images/placeholder-blog.jpg';
          return `
          <div class="blog-card">
            <img src="${imageUrl}" alt="${post.title || 'Blog post'}" class="blog-card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
            <div class="blog-card__body">
              <div class="blog-card__date">${post.published_at || post.publish_date ? new Date(post.published_at || post.publish_date).toLocaleDateString('fr-FR') : ''}</div>
              <span class="blog-card__category">${post.category || 'Blog'}</span>
              <h3 class="blog-card__title">${post.title || 'Blog post'}</h3>
              <p class="blog-card__text">${post.short_description || ''}</p>
              <a href="/fr/single-blog.html?slug=${post.slug || ''}" class="btn btn--primary btn--sm">Lire l'article</a>
            </div>
          </div>
        `;
        }).join('');
      })
      .catch(err => console.error('Error loading blog posts:', err));
  }

  function initInstagram() {
    fetch(`${API_BASE}/instagram-feed`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return { data: [] };
        return res.json().catch(() => ({ data: [] }));
      })
      .then(imagesRes => {
        const grid = document.getElementById('instagramGrid');
        if (!grid) return;
        
        const images = Array.isArray(imagesRes) ? imagesRes : (imagesRes?.data || []);
        if (!Array.isArray(images) || images.length === 0) {
          grid.innerHTML = '<p class="text-center">Suivez-nous sur Instagram pour voir nos dernières publications.</p>';
          return;
        }

        grid.innerHTML = images.slice(0, 16).map(img => `
          <a href="${img.link || 'https://instagram.com'}" target="_blank" rel="noopener" class="instagram-item">
            <img src="${img.image_url || '/fr/assets/images/placeholder-instagram.jpg'}" alt="Instagram" class="instagram-item__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
            <div class="instagram-item__overlay">
              <i class="fa-brands fa-instagram" style="font-size: 2rem; color: white;"></i>
            </div>
          </a>
        `).join('');
      })
      .catch(err => {
        console.error('Error loading Instagram feed:', err);
        const grid = document.getElementById('instagramGrid');
        if (grid) {
          grid.innerHTML = '<p>Chargement des images Instagram...</p>';
        }
      });
  }

 
});
