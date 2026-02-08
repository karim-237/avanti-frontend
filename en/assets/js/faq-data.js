const FAQ_DATA = {
  'company': [
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy on all products. Items must be unopened and in original packaging.' },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.' }
  ],
  'nutritional-dietary': [
    { question: 'Are your products gluten-free?', answer: 'Many of our rice products are naturally gluten-free. Please check individual product labels for specific dietary information.' },
    { question: 'Do you have vegan options?', answer: 'Yes, we offer a wide range of vegan rice products. Look for the vegan badge on product pages.' },
    { question: 'What is the nutritional information?', answer: 'Detailed nutritional information is available on each product page and packaging.' }
  ],
  'products': [
    { question: 'What types of rice do you offer?', answer: 'We offer Basmati, Jasmine, Long grain, Medium grain, Wholegrain, and Wild rice varieties.' },
    { question: 'How should I store your products?', answer: 'Store in a cool, dry place. Once opened, transfer to an airtight container.' },
    { question: 'Are your products organic?', answer: 'We offer both organic and conventional rice products. Look for the organic certification badge.' }
  ],
  'online-shop': [
    { question: 'How do I place an order?', answer: 'Browse our products, add items to your basket, and proceed to checkout. You can create an account or checkout as a guest.' },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' },
    { question: 'Can I track my order?', answer: 'Yes, once your order ships, you will receive a tracking number via email.' }
  ]
};

document.addEventListener('DOMContentLoaded', function() {
  const accordion = document.getElementById('faqAccordion');
  const sectionTitle = document.getElementById('faqSectionTitle');
  const tabs = document.querySelectorAll('.faq-tab');

  function displayFAQs(category) {
    if (!accordion) return;

    const faqs = FAQ_DATA[category] || [];
    const categoryTitle = category === 'all' ? 'All FAQs' : category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (sectionTitle) {
      sectionTitle.textContent = categoryTitle;
    }

    if (category === 'all') {
      let allHTML = '';
      Object.keys(FAQ_DATA).forEach(cat => {
        const catTitle = cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        allHTML += `<h3 style="margin-top: var(--spacing-xl); margin-bottom: var(--spacing-md); font-family: var(--font-heading);">${catTitle}</h3>`;
        FAQ_DATA[cat].forEach((faq, idx) => {
          allHTML += createFAQItem(faq, `${cat}-${idx}`);
        });
      });
      accordion.innerHTML = allHTML;
    } else {
      accordion.innerHTML = faqs.map((faq, idx) => createFAQItem(faq, `${category}-${idx}`)).join('');
    }

    initFAQItems();
  }

  function createFAQItem(faq, id) {
    return `
      <div class="faq-item" data-category="${id.split('-')[0]}" id="faq-${id}">
        <div class="faq-question">
          <span class="faq-question__text">${faq.question}</span>
          <i class="fa-solid fa-chevron-down faq-question__icon"></i>
        </div>
        <div class="faq-answer">
          <p class="faq-answer__text">${faq.answer}</p>
        </div>
      </div>
    `;
  }

  function initFAQItems() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question && !question.hasAttribute('data-listener')) {
        question.setAttribute('data-listener', 'true');
        question.addEventListener('click', function() {
          const isActive = item.classList.contains('active');
          items.forEach(i => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const category = this.getAttribute('data-category');
      displayFAQs(category);
    });
  });

  displayFAQs('all');
});
