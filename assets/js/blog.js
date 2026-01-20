

document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';
  let allPosts = [];
  let currentCategory = 'all';

  initCategories();
  loadBlogPosts();

  function initCategories() {
    const categoryTabs = document.querySelectorAll('.blog-category-tab');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        categoryTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
        filterPosts(currentCategory);
      });
    });
  }

  function filterPosts(category) {
    let filtered = allPosts;
    
    if (category !== 'all') {
      filtered = allPosts.filter(post => {
        const postCategory = (post.category || '').toLowerCase().replace(/\s+/g, '-');
        return postCategory === category;
      });
    }

    displayPosts(filtered);
  }

  function loadBlogPosts() {
    fetch(`${API_BASE}/blogs`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return [];
        return res.json().catch(() => []);
      })
      .then(result => {
        const posts = (result.success && Array.isArray(result.data)) 
          ? result.data 
          : (Array.isArray(result) ? result : []);
        
        allPosts = posts;
        
        const featured = posts.filter(p => p.featured).slice(0, 2);
        displayFeatured(featured);
        displayPosts(posts);
      })
      .catch(err => {
        console.error('Error loading blog posts:', err);
        const featuredGrid = document.getElementById('blogFeaturedGrid');
        const grid = document.getElementById('blogGrid');
        if (featuredGrid) featuredGrid.innerHTML = '<p class="text-center">Aucun article disponible.</p>';
        if (grid) grid.innerHTML = '<p class="text-center">Aucun article disponible.</p>';
      });
  }

  function displayFeatured(posts) {
    const grid = document.getElementById('blogFeaturedGrid');
    if (!grid) return;

    if (!Array.isArray(posts) || posts.length === 0) {
      grid.style.display = 'none';
      const featuredSection = grid.closest('.blog-featured');
      if (featuredSection) featuredSection.style.display = 'none';
      return;
    }

    grid.innerHTML = posts.map(post => {
      const imageUrl = post.image_url || post.image_path || post.single_image || post.single_image_xl || 'assets/images/placeholder-blog.jpg';
      return `
      <article class="blog-featured-card">
        <div class="blog-featured-card__image-wrapper">
          <img src="${imageUrl}" alt="${post.title || 'Blog post'}" class="blog-featured-card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
        </div>
        <div class="blog-featured-card__body">
          ${post.category ? `<span class="blog-featured-card__category">${post.category}</span>` : ''}
          <h2 class="blog-featured-card__title">${post.title || 'Article'}</h2>
          <div class="blog-featured-card__date">${new Date(post.published_at || post.publish_date || Date.now()).toLocaleDateString('fr-FR')}</div>
          <p class="blog-featured-card__description">${post.short_description || post.description || ''}</p>
          <a href="single-blog.html?slug=${post.slug}" class="btn btn--primary btn--sm">Lire l'article →</a>
        </div>
      </article>
    `;
    }).join('');
  }

  function displayPosts(posts) {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    if (posts.length === 0) {
      grid.innerHTML = '<p class="text-center">Aucun article trouvé.</p>';
      return;
    }

    grid.innerHTML = posts.map(post => {
      const imageUrl = post.image_url || post.image_path || post.single_image || post.single_image_xl || 'assets/images/placeholder-blog.jpg';
      return `
      <article class="blog-card">
        <div class="blog-card__image-wrapper">
          <img src="${imageUrl}" alt="${post.title || 'Blog post'}" class="blog-card__image" loading="lazy" onerror="if(this.src.indexOf('placeholder')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23F5F5F5\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%236A6A6A\' font-family=\'Arial\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';this.onerror=null;}">
          ${post.category ? `<div class="blog-card__category">${post.category}</div>` : ''}
        </div>
        <div class="blog-card__body">
          <div class="blog-card__date">${new Date(post.published_at || post.publish_date || Date.now()).toLocaleDateString('fr-FR')}</div>
          <h3 class="blog-card__title">${post.title || 'Article'}</h3>
          <p class="blog-card__description">${post.short_description || post.description || ''}</p>
          <a href="single-blog.html?slug=${post.slug}" class="btn btn--primary btn--sm">Lire l'article →</a>
        </div>
      </article>
    `;
    }).join(''); 
  }
});
