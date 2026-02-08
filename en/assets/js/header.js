


document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.header__mobile-toggle');
  const nav = document.querySelector('.header__nav');
  const countryDropdown = document.querySelector('.country-dropdown');
  const langDropdown = document.getElementById('lang-dropdown');

  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function() {
      const isActive = nav.classList.toggle('active');
      mobileToggle.classList.toggle('active', isActive);
      mobileToggle.setAttribute('aria-expanded', isActive);
    });

    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
        nav.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (countryDropdown && langDropdown) {
    countryDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = langDropdown.classList.toggle('show');
      countryDropdown.classList.toggle('active', isActive);
      countryDropdown.setAttribute('aria-expanded', isActive);
    });

    document.addEventListener('click', function(e) {
      if (!langDropdown.contains(e.target) && !countryDropdown.contains(e.target)) {
        langDropdown.classList.remove('show');
        countryDropdown.classList.remove('active');
        countryDropdown.setAttribute('aria-expanded', 'false');
      }
    });

    const langItems = langDropdown.querySelectorAll('.lang-dropdown-item');
    langItems.forEach(item => {
      item.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        const flag = this.querySelector('.lang-dropdown-item__flag').src;
        const text = this.textContent.trim();
        
        countryDropdown.querySelector('.country-dropdown__flag').src = flag;
        countryDropdown.querySelector('span').textContent = lang.toUpperCase();
        
        langDropdown.classList.remove('show');
        countryDropdown.classList.remove('active');
        countryDropdown.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu__link');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (currentPath.includes('products') && link.getAttribute('href').includes('products')) ||
        (currentPath.includes('recette') && link.getAttribute('href').includes('recette')) ||
        (currentPath.includes('blog') && link.getAttribute('href').includes('blog'))) {
      link.classList.add('active');
    }
  });
});
