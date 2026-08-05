// =======================================================
// SINGLE BLOG PAGE (single-bloc.html)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ single-blog.js chargé");

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  console.log("🔎 Slug extrait :", slug);

  const API_BASE = "https://avanti-backend-zeta.vercel.app/api";
  let CURRENT_BLOG_ID = null;

  // =======================================================
  // 🔹 1) CHARGEMENT DU BLOG PRINCIPAL
  // =======================================================
  if (!slug) {
    console.error("❌ Slug manquant");
    const contentEl = document.getElementById("blog-content");
    if (contentEl) contentEl.innerHTML = "<p>Blog introuvable (slug manquant).</p>";
    return;
  }

  fetch(`${API_BASE}/blogs/${slug}`)
    .then(res => {
      if (!res.ok || res.headers.get("content-type")?.includes("text/html")) {
        console.warn("⚠️ Single blog API returned HTML instead of JSON");
        return { success: false, message: "Réponse non JSON du serveur", data: null };
      }
      return res.json().catch(() => ({ success: false, message: "Erreur JSON", data: null }));
    })
    .then(data => {
      console.log("📦 API RAW:", data);

      if (!data.success) {
        console.error("❌ Backend a retourné une erreur :", data.message);
        const contentEl = document.getElementById("blog-content");
        if (contentEl) contentEl.innerHTML = `<p>Blog introuvable : ${data.message}</p>`;
        return;
      }

      if (!data.data || !data.data.blog) {
        console.error("❌ Blog non trouvé dans la réponse");
        const contentEl = document.getElementById("blog-content");
        if (contentEl) contentEl.innerHTML = "<p>Blog introuvable.</p>";
        return;
      }

      const { blog, tags, comments, featured } = data.data;
      CURRENT_BLOG_ID = blog.id; // ✅ stocké pour les commentaires

      // Injecter dans blog-comments.js si disponible
      if (window.setCurrentBlogId) {
        window.setCurrentBlogId(CURRENT_BLOG_ID);
      }

      // ===================== IMAGE PRINCIPALE =====================
      const mainImage = document.getElementById("main-image");
      if (mainImage) {
        mainImage.src = blog.single_image_xl || "";
        mainImage.alt = blog.title || "Blog image";
      }

      // ===================== TITRE =====================
      const titleEl = document.getElementById("blog-title");
      if (titleEl) titleEl.textContent = blog.title || "Titre indisponible";

      // ===================== AUTEUR =====================
      const authorEl = document.getElementById("author");
      if (authorEl) authorEl.textContent = "Avanti";

      // ===================== DATE =====================
      const dateEl = document.getElementById("date");
      if (dateEl && blog.publish_date) {
        dateEl.textContent = new Date(blog.publish_date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }

      // ===================== CONTENU =====================
      const contentEl = document.getElementById("blog-content");
      if (contentEl) contentEl.innerHTML = blog.full_content || "";

      // ===================== QUOTE =====================
      const quoteEl = document.getElementById("blog-quote");
      if (quoteEl) quoteEl.textContent = blog.quote || "";

      // ===================== PARAGRAPHES =====================
      const paragraph1El = document.getElementById("blog-paragraph-1");
      if (paragraph1El) paragraph1El.textContent = blog.paragraph_1 || "";

      const paragraph2El = document.getElementById("blog-paragraph-2");
      if (paragraph2El) paragraph2El.textContent = blog.paragraph_2 || "";

      // ===================== IMAGE SECONDAIRE =====================
      const secondImage = document.querySelector(".single-blog-image2 img");
      if (secondImage && blog.image_secondary) {
        secondImage.src = blog.image_secondary;
        secondImage.onerror = () => (secondImage.style.display = "none");
      }

      // ===================== TAGS =====================
      const tagsEl = document.querySelector(".single-blog-tags");
      if (tagsEl) {
        tagsEl.innerHTML = tags.length
          ? tags.map(tag => `<li><a class="button text-decoration-none">${tag.name}</a></li>`).join("")
          : "<li>Aucun tag</li>";
      }

      // ===================== AUTEUR BIO =====================
      const authorName = document.querySelector(".blog-author h4");
      const authorBio = document.querySelector(".blog-author p");
      if (authorName) authorName.textContent = "Avanti";
      if (authorBio) authorBio.textContent = blog.author_bio || "";

      // ===================== COMMENTAIRES =====================
      const commentsEl = document.querySelector(".blog-comments");
      if (commentsEl) {
        commentsEl.innerHTML = comments.length
          ? comments.map(
            c => `
              <div class="comment-single">
                <h5>${c.author_name}</h5>
                <span>${new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                <p>${c.message}</p>
              </div>
            `
          ).join("")
          : "<p>Aucun commentaire pour le moment</p>";
      }

      // ===================== ARTICLES À LA UNE =====================
      const featuredEl = document.querySelector(".box5");
      if (featuredEl) {
        featuredEl.innerHTML = featured.length
          ? `<h4>À la Une</h4>${featured.map(
            f => `
              <div class="feed">
                <img src="${f.image_url}" class="img-fluid" alt="${f.title}">
                <a href="/fr/single-blog.html?slug=${f.slug}">${f.title}</a>
              </div>
            `
          ).join("")}`
          : "<h4>À la Une</h4><p>Aucun article</p>";
      }

      console.log("✅ Blog chargé avec succès");
    })
    .catch(err => {
      console.error("❌ Erreur fetch blog :", err);
      const contentEl = document.getElementById("blog-content");
      if (contentEl) contentEl.innerHTML = "<p>Erreur lors du chargement du blog.</p>";
    });

  // =======================================================
  // 🔹 2) CHARGEMENT DES 5 DERNIERS BLOGS
  // =======================================================
  const latestBlogsEl = document.getElementById("latest-blogs"); 

  if (latestBlogsEl) {
    fetch(`${API_BASE}/blogs/latest`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur API latest blogs");
        return res.json();
      })
      .then(data => {
        if (!data.success || !Array.isArray(data.data)) {
          console.warn("⚠️ Réponse latest blogs invalide :", data);
          latestBlogsEl.innerHTML = "<li>Aucun article disponible</li>";
          return;
        }

        latestBlogsEl.innerHTML = data.data.length
          ? data.data.map(
            b => `
              <li class="d-flex mb-3">
                <img 
                  src="${b.image_url || ""}" 
                  alt="${b.title}" 
                  style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:10px;"
                >
                <div style="text-align: left; flex: 1;">
                  <a href="/fr/single-blog.html?slug=${b.slug}" class="fw-bold d-block">
                    ${b.title}
                  </a>
                  <small class="text-muted">
                    ${new Date(b.publish_date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
                  </small>
                </div>
              </li>
            `
          ).join("")
          : "<li>Aucun article disponible</li>";
      })
      .catch(err => {
        console.error("❌ Erreur fetch latest blogs :", err);
        latestBlogsEl.innerHTML = "<li>Erreur de chargement</li>";
      });
  } else {
    console.warn("⚠️ Élément #latest-blogs introuvable dans le DOM");
  }
});
