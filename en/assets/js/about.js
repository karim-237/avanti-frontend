document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'https://avanti-backend-zeta.vercel.app/api';

  init();

  function init() {
    loadAboutSection();
  }

  // =========================
  // 🔹 Charger section ABOUT
  // =========================
  function loadAboutSection() {
    fetch(`${API_BASE}/about/about-section`)
      .then(res => res.json())
      .then(result => {
        if (!result.success || !result.data) {
          console.warn('No About data found');
          return;
        }

        renderAbout(result.data);
      })
      .catch(err => {
        console.error('Erreur Loading About section:', err);
      });
  }

  // =========================
  // 🔹 Injection DOM
  // =========================
  function renderAbout(data) {

    // =========================
    // 🖼️ Images
    // =========================
    setImage('about-left-image', data.left_image);
    setImage('about-main-image', data.main_image);

    // Images secondaires (si tu veux les rendre dynamiques plus tard)
    // data.right_image
    // data.secondary_image

    // =========================
    // 🔢 Chiffres clés
    // =========================
    setText('experience-years', data.experience_years);
    setText('experience-text', data.experience_text);

    setText('satisfaction-percent', data.satisfaction_percent);
    setText('satisfaction-text', data.satisfaction_text);

    setText('products-sold', data.products_sold);
    setText('products-text', data.products_text);

    // =========================
    // 🏷️ Titres
    // =========================
    setText('about-small-title', data.small_title);
    setText('about-main-title', data.main_title);

    // =========================
    // 📝 Descriptions
    // =========================
    if (data.description) {
      setHTML('about-description', data.description);
      setHTML('aboutDescription', `<p>${data.description}</p>`);
    }

    // =========================
    // 🎥 Vidéo (optionnel – prêt)
    // =========================
    if (data.video_url) {
      console.log('Available video:', data.video_url);
      // Ici tu pourras plus tard injecter un iframe ou un modal vidéo
    }

    // =========================
    // 🕒 Meta (SEO / debug)
    // =========================
    console.info('About section loaded:', {
      created_at: data.created_at,
      updated_at: data.updated_at
    });
  }

  // =========================
  // 🛠️ Helpers
  // =========================
  function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value ?? '';
  }

  function setHTML(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = value ?? '';
  }

  function setImage(id, src) {
    const el = document.getElementById(id);
    if (!el) return;

    el.src = src || '/fr/assets/images/placeholder-about.jpg';
    el.loading = 'lazy';
  }
});
