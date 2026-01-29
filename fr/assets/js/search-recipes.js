const API_BASE = "https://avanti-backend-67wk.onrender.com/api";

$(document).ready(function () {
  // =============================
  // 1️⃣ Variables principales
  // =============================
  const searchInput = $("#searchrecipe"); // input recettes
  let resultsDropdown = null;

  if (!searchInput.length) return;

  // =============================
  // 2️⃣ Crée le conteneur dropdown
  // =============================
  function createDropdown() {
    if (!resultsDropdown) {
      resultsDropdown = $('<div id="searchblog-results-dropdown"></div>').css({
        position: "absolute",
        background: "#fff",
        "box-shadow": "0 2px 8px rgba(0,0,0,0.15)",
        "z-index": 9999,
        "max-height": "400px",
        overflow: "auto",
        "border-radius": "4px",
        "padding": "4px 0",
        display: "none",
        width: searchInput.outerWidth()
      });

      $("body").append(resultsDropdown);
    }
  }

  createDropdown();

  // =============================
  // 3️⃣ Positionnement dropdown
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
  // 4️⃣ Fetch résultats recettes
  // =============================
  async function fetchSearchResults(query) {
    if (!query || query.length < 2) return [];

    try {
      const response = await fetch(
        `${API_BASE}/search/recipes?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) return [];

      const data = await response.json();
      console.log("Search recipes API results:", data);

      return data.success ? data.data : [];
    } catch (error) {
      console.error("Search recipes API error:", error);
      return [];
    }
  }

  // =============================
  // 5️⃣ Rendu résultats
  // =============================
  function renderResults(results) {
    if (!resultsDropdown) return;

    if (!results || results.length === 0) {
      resultsDropdown
        .html('<p style="padding:8px;color:#666;">Aucun résultat</p>')
        .show();
      positionDropdown();
      return;
    }

    const html = results
      .map(item => {
        const title = item.title || "";
        const slug = item.slug || "";
        const image = item.image || "";

        return `
          <a href="/single-recipe.html?slug=${slug}" class="search-result-item" style="
            display:flex;
            align-items:center;
            padding:6px 12px;
            text-decoration:none;
            color:#333;
            border-bottom:1px solid #eee;
            transition:background 0.2s;
          ">
            ${
              image
                ? `<img src="${image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:8px;">`
                : ""
            }
            <div>
              <span>${title}</span><br>
              <small style="color:#999;">Recette</small>
            </div>
          </a>
        `;
      })
      .join("");

    resultsDropdown.html(html).show();
    positionDropdown();
  }

  // =============================
  // 6️⃣ Keyup input
  // =============================
  let typingTimeout = null;

  searchInput.on("keyup", function () {
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
  // 7️⃣ Click outside = fermer
  // =============================
  $(document).on("click", function (e) {
    if (
      !$(e.target).closest("#searchblog, #searchblog-results-dropdown").length
    ) {
      resultsDropdown.empty().hide();
    }
  });

  // =============================
  // 8️⃣ Scroll / resize
  // =============================
  $(window).on("scroll resize", function () {
    if (resultsDropdown && resultsDropdown.is(":visible")) {
      positionDropdown();
    }
  });
});


// =============================
// 🔹 Charger les dernières recettes
// =============================
const latestRecipesContainer = $("#latest-blogs"); // <ul id="latest-blogs">
const latestTitle = latestRecipesContainer.prev("h4");

if (latestTitle.length) {
  latestTitle.text("Recettes récentes"); // changement du titre
}

async function loadLatestRecipes(limit = 5) {
  if (!latestRecipesContainer.length) return;

  try {
    const response = await fetch(`${API_BASE}/recipes/latest?limit=${limit}`);
    if (!response.ok) return;

    const data = await response.json();
    const recipes = data.success ? data.data : [];

    if (!recipes.length) {
      latestRecipesContainer.html('<li>Aucune recette récente</li>');
      return;
    }

    const html = recipes
      .map(r => {
        const image = r.image_url || r.image || "";
        return `
                       <li class="d-flex mb-3">
                <img 
                  src="${image}" 
                  alt="${r.title}" 
                  style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:10px;"
                >
                <div style="text-align: left; flex: 1;">
                  <a href="single-recipe.html?slug=${r.slug}" class="fw-bold d-block">
                    ${r.title}
                  </a>
                  <small class="text-muted">
                    ${new Date(r.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
                  </small>
                </div>
              </li>
        `;
      })
      .join("");

    latestRecipesContainer.html(html);
  } catch (err) {
    console.error("Erreur chargement dernières recettes :", err);
    latestRecipesContainer.html('<li>Impossible de charger les recettes</li>');
  }
}

// Charger au démarrage
loadLatestRecipes();
