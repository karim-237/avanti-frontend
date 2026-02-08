document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  const faqTabs = document.querySelectorAll('.faq-tab');

  faqTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      faqTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      filterFAQs(category);
    });
  });

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  function filterFAQs(category) {
    faqItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (category === 'all' || itemCategory === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
      }
    });
  }
});
