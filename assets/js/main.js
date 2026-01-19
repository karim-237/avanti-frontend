/**
 * Main Application Entry Point
 *
 * Point d'entrée principal pour AVANTI Frontend v2.0
 * Initialise l'API client, charge les settings globaux,
 * et route vers les modules de page appropriés
 *
 * @author AVANTI Frontend v2.0
 * @version 2.0.0
 */




(function() {
  'use strict';

  /**
   * Application principale
   */
  const App = {
    // État de l'application
    state: {
      isInitialized: false,
      currentPage: null,
      apiClient: null,
      settings: null
    },

    /**
     * Initialiser l'application
     */
    async init() {
      console.log('[App] Initializing AVANTI Frontend v2.0...');

      try {
        // 1. Initialiser l'API Client
        this.initAPIClient();

        // 2. Charger les paramètres du site (logo, titre, maintenance mode)
        await this.loadSiteSettings();

        // 3. Détecter la page courante
        this.detectCurrentPage();

        // 4. Initialiser les composants globaux
        this.initGlobalComponents();

        // 5. Initialiser la page courante
        await this.initCurrentPage();

        this.state.isInitialized = true;
        console.log('[App] Initialization complete');

      } catch (error) {
        console.error('[App] Initialization failed:', error);
        this.showErrorMessage('Erreur lors du chargement de l\'application');
      }
    },

    /**
     * Initialiser l'API Client
     */
    initAPIClient() {
      console.log('[App] Initializing API Client...');

      // Créer instance API client
      this.state.apiClient = new APIClient('https://avanti-backend-67wk.onrender.com/api'); 

      // Rendre disponible globalement pour jQuery et autres scripts
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

        // Vérifier mode maintenance
        if (settings.maintenance_mode && !window.location.pathname.includes('coming-soon.html')) {
          console.warn('[App] Maintenance mode active, redirecting...');
          window.location.href = 'coming-soon.html';
          return;
        }

        // Mettre à jour le titre du site
        if (settings.site_name) {
          document.title = settings.site_name;

          // jQuery fallback si élément avec id existe
          if (typeof $ !== 'undefined' && $('#site-title').length) {
            $('#site-title').text(settings.site_name);
          }
        }

        // Mettre à jour le favicon
        if (settings.favicon_path) {
          const favicon = document.getElementById('favicon');
          if (favicon) {
            favicon.href = settings.favicon_path;
          }
        }

        // Mettre à jour le logo (header et footer)
        if (settings.logo_path) {
          // Logo header
          const headerLogo = document.getElementById('site-logo');
          if (headerLogo) {
            headerLogo.src = settings.logo_path;
            headerLogo.alt = settings.site_name || 'AVANTI';
          }

          // Logo footer (jQuery fallback)
          if (typeof $ !== 'undefined' && $('.footer-logo img').length) {
            $('.footer-logo img').attr('src', settings.logo_path);
          }
        }

        // Maintenance page
        if (window.location.pathname.includes('coming-soon.html')) {
          const msg = document.getElementById('maintenance-message');
          if (msg) {
            msg.textContent = settings.maintenance_message || 'Site en maintenance';
          }
        }

        console.log('[App] Site settings loaded:', settings);

      } catch (error) {
        console.error('[App] Failed to load site settings:', error);
        // Continuer avec valeurs par défaut
        this.state.settings = {
          site_name: 'AVANTI',
          logo_path: './assets/images/logo.png',
          maintenance_mode: false
        };
      }
    },

    /**
     * Détecter la page courante
     */
    detectCurrentPage() {
      const path = window.location.pathname;
      const filename = path.split('/').pop().replace('.html', '') || 'index';

      this.state.currentPage = filename;
      console.log('[App] Current page detected:', this.state.currentPage);
    },

    /**
     * Initialiser les composants globaux (présents sur toutes les pages)
     */
    initGlobalComponents() {
      console.log('[App] Initializing global components...');

      // Navigation handled by header.js
      // Skip Navigation.init() as it doesn't exist

      // Back to top button
      if (typeof BackToTop !== 'undefined') {
        BackToTop.init();
      }

      // Search functionality
      if (typeof Search !== 'undefined') {
        Search.init();
      }

      console.log('[App] Global components initialized');
    },

    /**
     * Initialiser la page courante
     */
    async initCurrentPage() {
      console.log(`[App] Initializing page: ${this.state.currentPage}`);

      switch (this.state.currentPage) {
        case 'index':
        case '':
          if (typeof Homepage !== 'undefined') {
            await Homepage.init();
          }
          break;

        case 'products':
          if (typeof ProductsPage !== 'undefined') {
            await ProductsPage.init();
          }
          break;

        case 'product-detail':
          if (typeof ProductDetail !== 'undefined') {
            await ProductDetail.init();
          }
          break;

        case 'blog':
          if (typeof BlogPage !== 'undefined') {
            await BlogPage.init();
          }
          break;

        case 'single-blog':
          if (typeof BlogDetail !== 'undefined') {
            await BlogDetail.init();
          }
          break;

        case 'recette':
          if (typeof RecipePage !== 'undefined') {
            await RecipePage.init();
          }
          break;

        case 'single-recipe':
          if (typeof RecipeDetail !== 'undefined') {
            await RecipeDetail.init();
          }
          break;

        case 'about':
          if (typeof AboutPage !== 'undefined') {
            await AboutPage.init();
          }
          break;

        case 'contact':
          if (typeof ContactPage !== 'undefined') {
            await ContactPage.init();
          }
          break;

        case 'faq':
          if (typeof FAQPage !== 'undefined') {
            await FAQPage.init();
          }
          break;

        default:
          console.log('[App] No specific page module for:', this.state.currentPage);
      }
    },

    /**
     * Afficher message d'erreur utilisateur
     */
    showErrorMessage(message) {
      // Créer notification simple
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

      // Auto-supprimer après 5 secondes
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 300ms';
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    },

    /**
     * Recharger l'application
     */
    reload() {
      window.location.reload();
    },

    /**
     * Obtenir l'état de l'application
     */
    getState() {
      return this.state;
    }
  };

  /**
   * Error Handler Global
   */
  window.ErrorHandler = {
    /**
     * Notifier l'utilisateur
     */
    notify(message, type = 'info') {
      console.log(`[ErrorHandler] ${type.toUpperCase()}:`, message);

      const colors = {
        info: '#5B8FD8',
        success: '#00BFA5',
        warning: '#FFC107',
        error: '#E84C3D'
      };

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

      // Auto-supprimer après 5 secondes
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 300ms';
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    }
  };

  /**
   * Initialiser au chargement du DOM
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

  // Rendre App disponible globalement pour debugging
  window.App = App;

  // Gestion des erreurs non capturées
  window.addEventListener('error', (event) => {
    console.error('[App] Uncaught error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[App] Unhandled promise rejection:', event.reason);
  });

})();
