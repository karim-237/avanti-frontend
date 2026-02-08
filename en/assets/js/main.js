(function() {
  'use strict';

  const App = {
    state: {
      isInitialized: false,
      currentPage: null,
      apiClient: null,
      settings: null
    },

    /**
     * Initialisation principale
     */
    async init() {
      const path = window.location.pathname.replace(/\/$/, ''); // enlever slash final
      const isMaintenancePage = path === '/coming-soon';

      // Si on est sur la page maintenance, stop tout
      if (isMaintenancePage) {
        console.log('[App] Maintenance page loaded, stopping initialization.');
        const msg = document.getElementById('maintenance-message');
        if (msg && this.state.settings?.maintenance_message) {
          msg.textContent = this.state.settings.maintenance_message;
        }
        return;
      }

      console.log('[App] Initializing AVANTI Frontend v2.0...');

      try {
        // 1. API Client
        this.initAPIClient();

        // 2. Charger les settings du site
        await this.loadSiteSettings();

        // 3. Si le site est en maintenance, rediriger vers /coming-soon
        if (this.state.settings?.maintenance_mode && !isMaintenancePage) {
          console.warn('[App] Maintenance mode active, redirecting...');
          window.location.replace('/coming-soon'); // pas .html
          return;
        }

        // 4. Détecter la page actuelle
        this.detectCurrentPage();

        // 5. Initialiser les composants globaux
        this.initGlobalComponents();

        // 6. Initialiser la page courante
        await this.initCurrentPage();

        this.state.isInitialized = true;
        console.log('[App] Initialization complete');

      } catch (error) {
        console.error('[App] Initialization failed:', error);
        this.showErrorMessage('Erreur lors du Loading de l\'application');
      }
    },

    /**
     * Initialiser l’API Client
     */
    initAPIClient() {
      console.log('[App] Initializing API Client...');
      this.state.apiClient = new APIClient('https://avanti-backend-67wk.onrender.com/api'); 
      window.api = this.state.apiClient;
      console.log('[App] API Client initialized');
    },

    /**
     * Charger les paramètres du site
     */
    async loadSiteSettings() {
      console.log('[App] Loading site settings...');
      try {
        const settings = await this.state.apiClient.get('/site-settings');
        this.state.settings = settings;

        // Titre du site
        if (settings.site_name) {
          document.title = settings.site_name;
          if (typeof $ !== 'undefined' && $('#site-title').length) {
            $('#site-title').text(settings.site_name);
          }
        }

        // Favicon
        if (settings.favicon_path) {
          const favicon = document.getElementById('favicon');
          if (favicon) favicon.href = settings.favicon_path;
        }

        // Logo
        if (settings.logo_path) {
          const headerLogo = document.getElementById('site-logo');
          if (headerLogo) {
            headerLogo.src = settings.logo_path;
            headerLogo.alt = settings.site_name || 'AVANTI';
          }
          if (typeof $ !== 'undefined' && $('.footer-logo img').length) {
            $('.footer-logo img').attr('src', settings.logo_path);
          }
        }

        // Page maintenance
        const path = window.location.pathname.replace(/\/$/, '');
        const isMaintenancePage = path === '/coming-soon';
        if (isMaintenancePage) {
          const msg = document.getElementById('maintenance-message');
          if (msg) {
            msg.textContent = settings.maintenance_message || 'Site en maintenance';
          }
        }

        console.log('[App] Site settings loaded:', settings);

      } catch (error) {
        console.error('[App] Failed to load site settings:', error);
        this.state.settings = {
          site_name: 'AVANTI',
          logo_path: '/fr/assets/images/logo.png',
          maintenance_mode: false
        };
      }
    },

    /**
     * Détecter la page courante
     */
    detectCurrentPage() {
      const path = window.location.pathname.replace(/\/$/, '');
      const filename = path.split('/').pop() || 'index';
      this.state.currentPage = filename;
      console.log('[App] Current page detected:', this.state.currentPage);
    },

    /**
     * Initialiser les composants globaux
     */
    initGlobalComponents() {
      console.log('[App] Initializing global components...');
      if (typeof BackToTop !== 'undefined') BackToTop.init();
      if (typeof Search !== 'undefined') Search.init();
      console.log('[App] Global components initialized');
    },

    /**
     * Initialiser la page courante
     */
    async initCurrentPage() {
      const path = window.location.pathname.replace(/\/$/, '');
      const isMaintenancePage = path === '/coming-soon';
      if (isMaintenancePage) return; // stop modules page

      console.log(`[App] Initializing page: ${this.state.currentPage}`);
      switch (this.state.currentPage) {
        case 'index':
        case '':
          if (typeof Homepage !== 'undefined') await Homepage.init();
          break;
        case 'products':
          if (typeof ProductsPage !== 'undefined') await ProductsPage.init();
          break;
        case 'product-detail':
          if (typeof ProductDetail !== 'undefined') await ProductDetail.init();
          break;
        case 'blog':
          if (typeof BlogPage !== 'undefined') await BlogPage.init();
          break;
        case 'single-blog':
          if (typeof BlogDetail !== 'undefined') await BlogDetail.init();
          break;
        case 'recette':
          if (typeof RecipePage !== 'undefined') await RecipePage.init();
          break;
        case 'single-recipe':
          if (typeof RecipeDetail !== 'undefined') await RecipeDetail.init();
          break;
        case 'about':
          if (typeof AboutPage !== 'undefined') await AboutPage.init();
          break;
        case 'contact':
          if (typeof ContactPage !== 'undefined') await ContactPage.init();
          break;
        case 'faq':
          if (typeof FAQPage !== 'undefined') await FAQPage.init();
          break;
        default:
          console.log('[App] No specific page module for:', this.state.currentPage);
      }
    },

    showErrorMessage(message) {
      const notification = document.createElement('div');
      notification.className = 'error-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #E84C3D;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Roboto', sans-serif;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 300ms';
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    },

    reload() { window.location.reload(); },
    getState() { return this.state; }
  };

  window.ErrorHandler = {
    notify(message, type = 'info') {
      console.log(`[ErrorHandler] ${type.toUpperCase()}:`, message);
      const colors = { info: '#5B8FD8', success: '#00BFA5', warning: '#FFC107', error: '#E84C3D' };
      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Roboto', sans-serif;
        max-width: 400px;
        animation: slideIn 300ms ease-out;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 300ms';
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

  window.App = App;
  window.addEventListener('error', (event) => console.error('[App] Uncaught error:', event.error));
  window.addEventListener('unhandledrejection', (event) => console.error('[App] Unhandled promise rejection:', event.reason));

})();
