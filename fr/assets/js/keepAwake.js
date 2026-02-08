// keepAwake.js
function keepBackendAlive(options = {}) {
  const intervalMinutes = options.intervalMinutes || 5; // toutes les X minutes
  const backendUrl = options.backendUrl || 'https://avanti-backend-67wk.onrender.com/health'; // endpoint health
  const onPing = options.onPing || null; // callback optionnel après chaque ping

  async function pingBackend() {
    // Vérifier si l'onglet est actif
    if (document.hidden) return;

    try {
      const res = await fetch(backendUrl, { cache: 'no-store' });
      if (res.ok) {
        console.log('Ping backend OK', new Date().toLocaleTimeString());
        if (onPing) onPing(await res.json()); // callback si fourni
      } else {
        console.warn('Ping backend failed', res.status);
      }
    } catch (err) {
      console.error('Ping backend error', err);
    }
  }

  // Ping immédiatement au chargement
  pingBackend();

  // Ping toutes les X minutes
  const intervalId = setInterval(pingBackend, intervalMinutes * 60 * 1000);

  // Retourne une fonction pour stopper le ping si besoin
  return () => clearInterval(intervalId);
}

export default keepBackendAlive;
