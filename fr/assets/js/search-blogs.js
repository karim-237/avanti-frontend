const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

$(document).ready(function () {
  // =============================
  // 1️⃣ Variables principales
  // =============================
  const searchInput = $('#searchblog'); // input spécifique à single-/fr/blog.html
  let resultsDropdown = null;

  // =============================
  // 2️⃣ Crée le conteneur pour les suggestions
  // =============================
  function createDropdown() {
    if (!resultsDropdown) {
      resultsDropdown = $('<div id="searchblog-results-dropdown"></div>').css({
        position: 'absolute',
        background: '#fff',
        'box-shadow': '0 2px 8px rgba(0,0,0,0.15)',
        'z-index': 9999,
        'max-height': '400px',
        overflow: 'auto',
        'border-radius': '4px',
        'padding': '4px 0',
        display: 'none',
        width: searchInput.outerWidth()
      });
      $('body').append(resultsDropdown); // On l'ajoute directement au body
    }
  }

  createDropdown();

  // =============================
  // 3️⃣ Fonction pour positionner le dropdown
  // =============================
  function positionDropdown() {
    const offset = searchInput.offset();
    const inputHeight = searchInput.outerHeight();
    resultsDropdown.css({
      top: offset.top + inputHeight,
      left: offset.left,
      width: searchInput.outerWidth()
    });
  }

  // =============================
  // 4️⃣ Fonction pour récupérer les suggestions
  // =============================
  async function fetchSearchResults(query) {
    if (!query || query.length < 2) return [];
    try {
      const response = await fetch(`${API_BASE}/search/blogs?q=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      const data = await response.json();
      console.log('Search blogs API results:', data); // debug
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Search blogs API error:', error);
      return [];
    }
  }

  // =============================
  // 5️⃣ Affichage des suggestions
  // =============================
  function renderResults(results) {
    if (!resultsDropdown) return;

    if (!results || results.length === 0) {
      resultsDropdown.html('<p style="padding: 8px; color: #666;">Aucun résultat</p>').show();
      positionDropdown();
      return;
    }

    const html = results
      .map(item => {
        const title = item.title || '';
        const slug = item.slug || '';
        const image = item.image || '';
        return `
          <a href="/fr/single-blog.html?slug=${slug}" class="search-result-item" style="
            display:flex; align-items:center; padding:6px 12px; text-decoration:none; color:#333; border-bottom:1px solid #eee;
            transition: background 0.2s;
          ">
            ${image ? `<img src="${image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; margin-right:8px;">` : ''}
            <div>
              <span>${title}</span><br>
              <small style="color:#999;">Blog</small>
            </div>
          </a>
        `;
      })
      .join('');

    resultsDropdown.html(html).show();
    positionDropdown(); // On repositionne à chaque rendu
  }

  // =============================
  // 6️⃣ Gestion du keyup sur l'input
  // =============================
  let typingTimeout = null;

  searchInput.on('keyup', function () {
    const query = $(this).val().trim();
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(async () => {
      if (!query) {
        resultsDropdown.empty().hide();
        return;
      }

      const results = await fetchSearchResults(query);
      renderResults(results);
    }, 300);
  });

  // =============================
  // 7️⃣ Fermer le dropdown si clic en dehors
  // =============================
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#searchblog, #searchblog-results-dropdown').length) {
      resultsDropdown.empty().hide();
    }
  });

  // =============================
  // 8️⃣ Repositionner le dropdown si la fenêtre bouge ou resize
  // =============================
  $(window).on('scroll resize', function () {
    if (resultsDropdown && resultsDropdown.is(':visible')) {
      positionDropdown();
    }
  });
});
