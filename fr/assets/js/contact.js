// =======================================================
// CONTACT FORM - Stockage en DB
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://avanti-backend-67wk.onrender.com/api";
  const formEl = document.getElementById("contactForm");

  if (!formEl) {
    console.warn("⚠️ Formulaire contact introuvable");
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
      alert("Veuillez remplir tous les champs obligatoires.");
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
        alert(data.message || "Erreur lors de l’enregistrement du message.");
        return;
      }

      console.log("✅ Message enregistré :", data.data);
      alert("Merci 🙏 Votre message a bien été enregistré !");
      formEl.reset();
    } catch (err) {
      console.error("❌ Contact fetch error :", err);
      alert("Erreur réseau ou serveur. Veuillez réessayer.");
    }
  });
});
