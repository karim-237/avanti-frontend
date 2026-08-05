// =======================================================
// NEWSLETTER
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ newsletter.js chargé");

  const API_BASE = "https://avanti-backend-zeta.vercel.app/api";

  const formEl = document.getElementById("newsletterForm");
  const emailInputEl = document.getElementById("newsletterEmail");

  if (!formEl || !emailInputEl) {
    console.warn("⚠️ Formulaire newsletter introuvable");
    return;
  }

  formEl.addEventListener("submit", e => {
    e.preventDefault();

    const email = emailInputEl.value.trim();

    if (!email) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    const payload = { email };

    console.log("📨 Payload newsletter :", payload);

   fetch(`${API_BASE}/newsletter`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
  .then(async res => {
    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      throw new Error(data?.message || "Erreur lors de l’inscription");
    }

    return data;
  })
  .then(data => {
    if (!data.success) {
      alert(data.message || "Erreur lors de l’inscription");
      return;
    }

    console.log("✅ Newsletter OK :", data.data);
    alert("Merci 🎉 Vous êtes inscrit à la newsletter !");
    emailInputEl.value = "";
  })
  .catch(err => {
    console.error("❌ Erreur newsletter :", err.message);
    alert("Erreur lors de l'inscription. Veuillez réessayer.");
  });
  });
});
