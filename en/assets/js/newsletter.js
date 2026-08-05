// =======================================================
// NEWSLETTER
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ newsletter.js chargé");

  const API_BASE = "https://avanti-backend-zeta.vercel.app/api";

  const formEl = document.getElementById("newsletterForm");
  const emailInputEl = document.getElementById("newsletterEmail");

  if (!formEl || !emailInputEl) {
    console.warn("⚠️ Newsletter form not found");
    return;
  }

  formEl.addEventListener("submit", e => {
    e.preventDefault();

    const email = emailInputEl.value.trim();

    if (!email) {
      alert("Please enter a valid email address.");
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
      throw new Error(data?.message || "Error during registration");
    }

    return data;
  })
  .then(data => {
    if (!data.success) {
      alert(data.message || "Error during registration");
      return;
    }

    console.log("✅ Newsletter OK :", data.data);
    alert("Thank you 🎉 You are subscribed to the newsletter !");
    emailInputEl.value = "";
  })
  .catch(err => {
    console.error("❌ Error newsletter :", err.message);
    alert("Error during registration. Please retry.");
  });
  });
});
