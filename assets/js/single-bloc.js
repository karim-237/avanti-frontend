// =======================================================
// SINGLE BLOG PAGE (single-bloc.html)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ single-blog.js chargé");

  if (!window.location.pathname.includes("single-blog.html")) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  console.log("🔎 Slug extrait :", slug);

  if (!slug) {
    console.error("❌ Slug manquant");
    return;
  }

  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';

  fetch(`${API_BASE}/blogs/${slug}`)
    .then(res => {
      if (!res.ok || res.headers.get("content-type")?.includes("text/html")) {
        console.warn("⚠️ Single blog API returned HTML instead of JSON");
        return { success: false, data: null };
      }
      return res.json().catch(() => ({ success: false, data: null }));
    })
    .then(data => {
      console.log("📦 API RAW:", data);

      if (!data.success || !data.data) {
        console.error("❌ Pas de données retournées par l'API");
        return;
      }

      const { blog, tags, comments, featured } = data.data;

      if (!blog) {
        console.error("❌ Blog non trouvé dans la réponse");
        return;
      }

      // ===================== IMAGE PRINCIPALE =====================
      const mainImage = document.getElementById("main-image");
      if (mainImage) {
        if (blog.single_image_xl) {
          mainImage.src = blog.single_image_xl;
        }
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
        setImageWithErrorHandler(secondImage, blog.image_secondary);
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
          ? comments
            .map(
              c => `
          <div class="comment-single">
            <h5>${c.author_name}</h5>
            <span>${new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
            <p>${c.message}</p>
          </div>
        `
            )
            .join("")
          : "<p>Aucun commentaire pour le moment</p>";
      }

      // ===================== ARTICLES À LA UNE =====================
      const featuredEl = document.querySelector(".box5");
      if (featuredEl) {
        featuredEl.innerHTML = featured.length
          ? `<h4>À la Une</h4>${featured
            .map(
              f => `
            <div class="feed">
              <img src="${f.image_url}" class="img-fluid" alt="${f.title}">
              <a href="single-blog.html?slug=${f.slug}">${f.title}</a>
            </div>
          `
            )
            .join("")}`
          : "<h4>À la Une</h4><p>Aucun article</p>";
      }

      console.log("✅ Blog chargé avec succès");
    })
    .catch(err => console.error("❌ Erreur fetch blog :", err));
});