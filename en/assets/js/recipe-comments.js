// =======================================================
// RECIPE COMMENTS (/en/single-blog.html)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ recipe-comments.js chargé");

  const API_BASE = "https://avanti-backend-67wk.onrender.com/api";

  const commentsCountEl = document.getElementById("comments-count");
  const commentsListEl = document.getElementById("blog-comments");
  const formEl = document.getElementById("recipe-comment-form");

  // ⚠️ recipeId injecté depuis single-blog.js
  let currentRecipeId = null;

  // -------------------------------------------------------
  // 🔹 Hook depuis single-recipe.js
  // -------------------------------------------------------
  window.setCurrentRecipeId = function (recipeId) {
    currentRecipeId = recipeId;
    console.log("🧩 recipeId reçu pour commentaires :", recipeId);
    loadComments();
  };

  // -------------------------------------------------------
  // 📥 Charger les commentaires
  // -------------------------------------------------------
  function loadComments() {
    if (!currentRecipeId) return;

    fetch(`${API_BASE}/recipe_comments/recipe/${currentRecipeId}`)
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
          commentsCountEl.textContent = `${total} Comment(s)`;
        }

        // liste
        if (commentsListEl) {
          commentsListEl.innerHTML = total
            ? comments.map(renderComment).join("")
            : "<p>No comments yet</p>";
        }
      })
      .catch(err => {
        console.error("❌ Erreur Loading commentaires :", err);
      });
  }

  // -------------------------------------------------------
  // 🧱 Template commentaire
  // -------------------------------------------------------
  function renderComment(c) {
    return `
      <div class="comment-single">
        <h5>${escapeHtml(c.name)}</h5>
        <span>
          ${new Date(c.created_at).toLocaleDateString("en-EN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
        </span>
        <p>${escapeHtml(c.comment )}</p>
      </div>
    `;
  }

 // -------------------------------------------------------
// ➕ Submit nouveau commentaire
// -------------------------------------------------------
if (formEl) {
  formEl.addEventListener("submit", e => {
    e.preventDefault(); // ⛔ empêche POST HTML

    if (!currentRecipeId) {
      alert("Recipe not found.");
      return;
    }

    const payload = {
      recipe_id: currentRecipeId,
      name: document.getElementById("comment-author").value.trim(),
      email: document.getElementById("comment-email").value.trim(),
      comment : document.getElementById("comment-message").value.trim()
    };

    if (!payload.name || !payload.email || !payload.comment ) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Payload envoyé :", payload);


    fetch(`${API_BASE}/recipe_comments/recipe`, {
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
          alert(data.comment  || "Error sending comment");
          return;
        }

        console.log("✅ Commentaire ajouté :", data.data);

        alert("Comment successfully published 🎉");

        // 🔁 Reload page après succès
        setTimeout(() => {
          window.location.reload();
        }, 800);
      })
      .catch(err => {
        console.error("❌ Erreur ajout commentaire :", err);
        alert("Error sending comment");
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
