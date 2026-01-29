


document.addEventListener('DOMContentLoaded', function() {
  // Sélectionner le logo déjà présent dans le footer
  const footerLogo = document.getElementById('footer-logo');
  if (!footerLogo) return; // Si le footer n'existe pas ou pas de logo, on quitte

  function loadFooterLogo() {
    const siteLogo = document.getElementById('site-logo');

    if (siteLogo && siteLogo.src && !siteLogo.src.includes('data:image/svg')) {
      footerLogo.src = siteLogo.src;
    } else {
      // Sinon charger depuis l'API
      fetch('https://avanti-backend-67wk.onrender.com/api/site-settings')
        .then(res => res.ok ? res.json() : {})
        .then(settings => {
          footerLogo.src = settings.logo_path || 'assets/images/placeholder-logo.png';
        })
        .catch(() => {
          footerLogo.src = 'assets/images/placeholder-logo.png';
        });
    }

    // Fallback si l'image ne charge pas
    footerLogo.onerror = function() {
      this.src = 'assets/images/placeholder-logo.png';
      this.onerror = null;
    };
  }

  // Charger le logo immédiatement
  loadFooterLogo();

  // Observer le DOM pour attendre que site-logo soit disponible
  const observer = new MutationObserver((mutations, obs) => {
    const siteLogo = document.getElementById('site-logo');
    if (siteLogo && siteLogo.src && !siteLogo.src.includes('data:image/svg')) {
      loadFooterLogo();
      obs.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
