const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';


$(document).ready(function () {
  // =============================
  // 1️⃣ Variables principales
  // =============================
  const searchOverlay = $('#search');
  const searchInput = $('#search-input'); // Assurez-vous que l'input possède id="search-input"
  let resultsDropdown = null;

  // Crée le conteneur pour les suggestions
  function createDropdown() {
    if (!resultsDropdown) {
      resultsDropdown = $('<div id="search-results-dropdown"></div>').css({
        position: 'absolute',
        top: searchInput.outerHeight(),
        left: 0,
        right: 0,
        background: '#fff',
        'box-shadow': '0 2px 8px rgba(0,0,0,0.15)',
        'z-index': 9999,
        'max-height': '400px',
        overflow: 'auto',
        'border-radius': '4px',
        'padding': '4px 0',
        display: 'none'
      });
      searchInput.parent().css('position', 'relative').append(resultsDropdown);
    }
  }

  createDropdown();

  // =============================
  // 2️⃣ Gestion ouverture/fermeture overlay
  // =============================
  $('a[href="#search"]').on('click', function (event) {
    event.preventDefault();
    searchOverlay.addClass('open');
    searchInput.focus();
  });

  $('#search, #search button.close').on('click keyup', function (event) {
    if (event.target === this || event.target.className === 'close' || event.keyCode === 27) {
      searchOverlay.removeClass('open');
      resultsDropdown.empty().hide();
    }
  });

  // =============================
  // 3️⃣ Fonction pour récupérer les suggestions
  // =============================
  async function fetchSearchResults(query) {
    if (!query || query.length < 2) return [];
    try {
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      const data = await response.json();
      console.log('API results:', data); // <== debug
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Search API error:', error);
      return [];
    }
  }

  // =============================
  // 4️⃣ Affichage des suggestions
  // =============================
  function renderResults(results) {
    if (!resultsDropdown) return;

    if (!results || results.length === 0) {
      resultsDropdown.html('<p style="padding: 8px; color: #666;">Aucun résultat</p>').show();
      return;
    }

    const html = results
      .map(item => {
        const title = item.title || '';
        const slug = item.slug || '';
        const type = item.type.charAt(0).toUpperCase() + item.type.slice(1); // Produit, Blog, Recipe
        const image = item.image || '';
        return `
          <a href="${getDetailUrl(item.type, slug)}" class="search-result-item" style="
            display:flex; align-items:center; padding:6px 12px; text-decoration:none; color:#333; border-bottom:1px solid #eee;
            transition: background 0.2s;
          ">
            ${image ? `<img src="${image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; margin-right:8px;">` : ''}
            <div>
              <span>${title}</span><br>
              <small style="color:#999;">${type}</small>
            </div>
          </a>
        `;
      })
      .join('');

    resultsDropdown.html(html).show();
  }

  // =============================
  // 5️⃣ Gestion du keyup sur l'input
  // =============================
  let typingTimeout = null;

  searchInput.on('keyup', function () {
    const query = $(this).val().trim();
    console.log('Search input:', query);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(async () => {
      if (!query) {
        resultsDropdown.empty().hide();
        console.log('Input vide, dropdown vidé');
        return;
      }

      const results = await fetchSearchResults(query);
      renderResults(results);
    }, 300); // délai pour limiter les requêtes
  });

  // =============================
  // 6️⃣ Générer URL vers le détail selon le type
  // =============================
  function getDetailUrl(type, slug) {
    switch (type) {
      case 'product':
        return `/product-detail.html?slug=${slug}`;
      case 'blog':
        return `/single-blog.html?slug=${slug}`;
      case 'recipe':
        return `/single-recipe.html?slug=${slug}`;
      default:
        return '#';
    }
  }

  // =============================
  // 7️⃣ Fermer le dropdown si clic en dehors
  // =============================
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#search, #search-results-dropdown').length) {
      resultsDropdown.empty().hide();
    }
  });
});
