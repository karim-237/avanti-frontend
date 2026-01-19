

document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'https://avanti-backend-67wk.onrender.com/api';
  const form = document.getElementById('contactForm');
  const contactInfo = document.getElementById('contactInfo');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: this.querySelector('[name="name"]')?.value || '',
        email: this.querySelector('[name="email"]')?.value || '',
        subject: this.querySelector('[name="subject"]')?.value || '',
        message: this.querySelector('[name="message"]')?.value || ''
      };

      fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(data => {
        alert('Message envoyé avec succès!');
        form.reset();
      })
      .catch(err => {
        console.error('Error sending message:', err);
        alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      });
    });
  }

  if (contactInfo) {
    fetch(`${API_BASE}/contact-info`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json().catch(() => null);
      })
      .then(result => {
        if (!result) return;
        const info = result.success ? result.data : result;
        
        const phoneEl = document.getElementById('contactPhone');
        const emailEl = document.getElementById('contactEmail');
        const addressEl = document.getElementById('contactAddress');
        
        if (phoneEl && info.phone) phoneEl.textContent = info.phone;
        if (emailEl && info.email) {
          emailEl.href = `mailto:${info.email}`;
          emailEl.textContent = info.email;
        }
        if (addressEl && info.address) addressEl.textContent = info.address;
      })
      .catch(err => console.error('Error loading contact info:', err));
  }
});
