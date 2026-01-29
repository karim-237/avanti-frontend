/**
 * API Client - Centralized API Communication Layer
 *
 * Remplace global.js monolithique (1,244 lignes)
 * Fonctionnalités:
 * - Cache en mémoire avec expiration
 * - Gestion centralisée des erreurs
 * - Graceful degradation si API down
 * - Logs détaillés pour debugging
 * - Compatible avec jQuery
 *
 * @author AVANTI Frontend v2.0
 * @version 2.0.0
 */

class APIClient {
  /**
   * Constructeur
   * @param {string} baseURL - URL de base de l'API (default: localhost:5000)
   */
  constructor(baseURL = 'https://avanti-backend-67wk.onrender.com/api') {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes en millisecondes
    this.requestQueue = [];
    this.isProcessing = false;

    // Configuration
    this.config = {
      timeout: 10000, // 10 secondes
      retryAttempts: 2,
      retryDelay: 1000 // 1 seconde
    };

    console.log('[APIClient] Initialized with baseURL:', this.baseURL);
  }

  /**
   * GET request avec cache
   * @param {string} endpoint - Endpoint de l'API (ex: '/products')
   * @param {Object} options - Options fetch additionnelles
   * @returns {Promise<any>} - Données de l'API
   */
  async get(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this._getCacheKey(url, options);

    // Vérifier le cache d'abord
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      const age = Date.now() - timestamp;

      if (age < this.cacheTimeout) {
        console.log(`[APIClient] Cache HIT: ${endpoint} (age: ${Math.round(age / 1000)}s)`);
        return data;
      } else {
        // Cache expiré, le supprimer
        this.cache.delete(cacheKey);
        console.log(`[APIClient] Cache EXPIRED: ${endpoint}`);
      }
    }

    // Fetch avec retry logic
    try {
      console.log(`[APIClient] Fetching: ${endpoint}`);
      const startTime = performance.now();

      const response = await this._fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);

      // Mettre en cache la réponse réussie
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      console.log(`[APIClient] Success: ${endpoint} (${duration}ms)`, data);
      return data;

    } catch (error) {
      console.error(`[APIClient] Error: ${endpoint}`, error);
      return this._handleError(error, endpoint);
    }
  }

  /**
   * POST request
   * @param {string} endpoint - Endpoint de l'API
   * @param {Object} body - Corps de la requête
   * @param {Object} options - Options fetch additionnelles
   * @returns {Promise<any>} - Réponse de l'API
   */
  async post(endpoint, body, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      console.log(`[APIClient] Posting to: ${endpoint}`, body);
      const startTime = performance.now();

      const response = await this._fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(body),
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);

      console.log(`[APIClient] Post Success: ${endpoint} (${duration}ms)`, data);
      return data;

    } catch (error) {
      console.error(`[APIClient] Post Error: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * PUT request
   * @param {string} endpoint - Endpoint de l'API
   * @param {Object} body - Corps de la requête
   * @param {Object} options - Options fetch additionnelles
   * @returns {Promise<any>} - Réponse de l'API
   */
  async put(endpoint, body, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      console.log(`[APIClient] Putting to: ${endpoint}`, body);

      const response = await this._fetchWithRetry(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(body),
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[APIClient] Put Success: ${endpoint}`, data);
      return data;

    } catch (error) {
      console.error(`[APIClient] Put Error: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * DELETE request
   * @param {string} endpoint - Endpoint de l'API
   * @param {Object} options - Options fetch additionnelles
   * @returns {Promise<any>} - Réponse de l'API
   */
  async delete(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      console.log(`[APIClient] Deleting: ${endpoint}`);

      const response = await this._fetchWithRetry(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[APIClient] Delete Success: ${endpoint}`, data);
      return data;

    } catch (error) {
      console.error(`[APIClient] Delete Error: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Fetch avec retry logic
   * @private
   * @param {string} url - URL complète
   * @param {Object} options - Options fetch
   * @returns {Promise<Response>} - Réponse fetch
   */
  async _fetchWithRetry(url, options) {
    let lastError;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`[APIClient] Retry attempt ${attempt}/${this.config.retryAttempts}`);
          await this._delay(this.config.retryDelay * attempt);
        }

        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(this.config.timeout)
        });

        return response;

      } catch (error) {
        lastError = error;
        console.warn(`[APIClient] Attempt ${attempt + 1} failed:`, error.message);
      }
    }

    throw lastError;
  }

  /**
   * Gestion des erreurs avec graceful degradation
   * @private
   * @param {Error} error - Erreur capturée
   * @param {string} endpoint - Endpoint qui a échoué
   * @returns {any} - Structure de données vide selon le type d'endpoint
   */
  _handleError(error, endpoint) {
    // Afficher notification utilisateur
    if (window.ErrorHandler) {
      window.ErrorHandler.notify(
        'Impossible de charger les données. Veuillez réessayer.',
        'error'
      );
    }

    // Retourner structure de données vide selon le type d'endpoint
    if (endpoint.includes('/products') ||
        endpoint.includes('/blogs') ||
        endpoint.includes('/recipes') ||
        endpoint.includes('/categories') ||
        endpoint.includes('/banners')) {
      return [];
    }

    if (endpoint.includes('/settings')) {
      return {
        site_name: 'AVANTI',
        logo_path: '/fr/assets/images/logo.png',
        favicon_path: '/fr/assets/images/favicon.ico',
        maintenance_mode: false
      };
    }

    return {};
  }

  /**
   * Générer clé de cache
   * @private
   * @param {string} url - URL de la requête
   * @param {Object} options - Options de la requête
   * @returns {string} - Clé de cache unique
   */
  _getCacheKey(url, options) {
    const optionsString = JSON.stringify(options);
    return `${url}_${optionsString}`;
  }

  /**
   * Délai (pour retry)
   * @private
   * @param {number} ms - Millisecondes
   * @returns {Promise} - Promise qui se résout après le délai
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Vider le cache manuellement
   * @public
   */
  clearCache() {
    this.cache.clear();
    console.log('[APIClient] Cache cleared');
  }

  /**
   * Obtenir statistiques du cache
   * @public
   * @returns {Object} - Stats du cache
   */
  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    const stats = {
      total: entries.length,
      valid: 0,
      expired: 0,
      size: 0
    };

    entries.forEach(([key, value]) => {
      const age = now - value.timestamp;
      if (age < this.cacheTimeout) {
        stats.valid++;
      } else {
        stats.expired++;
      }
      stats.size += JSON.stringify(value).length;
    });

    return stats;
  }

  /**
   * Précharger des endpoints
   * @public
   * @param {Array<string>} endpoints - Liste d'endpoints à précharger
   */
  async preload(endpoints) {
    console.log('[APIClient] Preloading endpoints:', endpoints);

    const promises = endpoints.map(endpoint =>
      this.get(endpoint).catch(error => {
        console.warn(`[APIClient] Preload failed for ${endpoint}:`, error);
        return null;
      })
    );

    await Promise.all(promises);
    console.log('[APIClient] Preload complete');
  }

  /**
   * Charger plusieurs endpoints en parallèle
   * @public
   * @param {Array<string>} endpoints - Liste d'endpoints
   * @returns {Promise<Array>} - Résultats de tous les endpoints
   */
  async batchGet(endpoints) {
    console.log('[APIClient] Batch GET:', endpoints);

    const promises = endpoints.map(endpoint =>
      this.get(endpoint)
    );

    return Promise.all(promises);
  }
}

// Exporter pour utilisation globale
if (typeof window !== 'undefined') {
  window.APIClient = APIClient;
}

// Export pour modules ES6 (si utilisé avec build system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIClient;
}
