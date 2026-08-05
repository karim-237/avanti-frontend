// =======================================================
// BLOG COMMENTS (single-/fr/blog.html)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ blog-comments.js chargé");

  const API_BASE = "https://avanti-backend-zeta.vercel.app/api";

  const commentsCountEl = document.getElementById("comments-count");
  const commentsListEl = document.getElementById("blog-comments");
  const formEl = document.getElementById("blog-comment-form");

  // ⚠️ blogId injecté depuis single-blog.js
  let currentBlogId = null;

  // -------------------------------------------------------
  // 🔹 Hook depuis single-blog.js
  // -------------------------------------------------------
  window.setCurrentBlogId = function (blogId) {
    currentBlogId = blogId;
    console.log("🧩 blogId reçu pour commentaires :", blogId);
    loadComments();
  };

  // -------------------------------------------------------
  // 📥 Charger les commentaires
  // -------------------------------------------------------
  function loadComments() {
    if (!currentBlogId) return;

    fetch(`${API_BASE}/comments/blog/${currentBlogId}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur API get comments");
        return res.json();
      })
      .then(data => {
        if (!data.success) {
          console.warn("⚠️ API comments error:", data);
          return;
        }

        const { total, comments } = data.data;

        // compteur
        if (commentsCountEl) {
          commentsCountEl.textContent = `${total} Commentaire(s)`;
        }

        // liste
        if (commentsListEl) {
          commentsListEl.innerHTML = total
            ? comments.map(renderComment).join("")
            : "<p>Aucun commentaire pour le moment</p>";
        }
      })
      .catch(err => {
        console.error("❌ Erreur chargement commentaires :", err);
      });
  }

  // -------------------------------------------------------
  // 🧱 Template commentaire
  // -------------------------------------------------------
  function renderComment(c) {
    return `
      <div class="comment-single">
        <h5>${escapeHtml(c.author_name)}</h5>
        <span>
          ${new Date(c.created_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
        </span>
        <p>${escapeHtml(c.message)}</p>
      </div>
    `;
  }

 // -------------------------------------------------------
// ➕ Submit nouveau commentaire
// -------------------------------------------------------
if (formEl) {
  formEl.addEventListener("submit", e => {
    e.preventDefault(); // ⛔ empêche POST HTML

    if (!currentBlogId) {
      alert("Blog introuvable.");
      return;
    }

    const payload = {
      blog_id: currentBlogId,
      author_name: document.getElementById("comment-author").value.trim(),
      email: document.getElementById("comment-email").value.trim(),
      message: document.getElementById("comment-message").value.trim()
    };

    if (!payload.author_name || !payload.email || !payload.message) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }

    fetch(`${API_BASE}/comments/blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur API add comment");
        return res.json();
      })
      .then(data => {
        if (!data.success) {
          alert(data.message || "Erreur lors de l’envoi du commentaire");
          return;
        }

        console.log("✅ Commentaire ajouté :", data.data);

        alert("Commentaire publié avec succès 🎉");

        // 🔁 Reload page après succès
        setTimeout(() => {
          window.location.reload();
        }, 800);
      })
      .catch(err => {
        console.error("❌ Erreur ajout commentaire :", err);
        alert("Erreur lors de l’envoi du commentaire");
      });
  });
}


  // -------------------------------------------------------
  // 🔐 Petite protection XSS basique
  // -------------------------------------------------------
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
});
