// =======================================================
// CONTACT FORM - Stockage en DB
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://avanti-backend-67wk.onrender.com/api";
  const formEl = document.getElementById("contactForm");

  if (!formEl) {
    console.warn("⚠️ Contact form not found");
    return;
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔹 Récupération des valeurs du formulaire
    const payload = {
      name: document.getElementById("contactName").value.trim(),
      email: document.getElementById("contactEmailInput").value.trim(),
      subject: document.getElementById("contactSubject").value.trim(),
      message: document.getElementById("contactMessage").value.trim(),
    };

    // 🔹 Vérification des champs obligatoires
    if (!payload.name || !payload.email || !payload.message) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("📨 Contact payload :", payload);

    try {
      // 🔹 Envoi vers l'API
      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("❌ Erreur backend :", data);
        alert(data.message || "Error saving message.");
        return;
      }

      console.log("✅ Recorded message :", data.data);
      alert("Thank you 🙏 Your message has been successfully recorded. !");
      formEl.reset();
    } catch (err) {
      console.error("❌ Contact fetch error :", err);
      alert("Network or server error. Please try again.");
    }
  });
});
