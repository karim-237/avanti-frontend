// ===============================
// GLOBAL.JS – VERSION PRODUCTION
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const isMaintenancePage = window.location.pathname.endsWith("coming-soon.html");

  // ===============================
  // MODE MAINTENANCE
  // ===============================
  if (isMaintenancePage) {
    console.log("[global.js] Maintenance page loaded, stopping all dynamic scripts.");

    // Titre
    const titleEl = document.getElementById("site-title");
    if (titleEl) titleEl.textContent = "Site under maintenance";

    // Favicon
    const faviconEl = document.getElementById("favicon");
    if (faviconEl) faviconEl.href = "/images/favicon.ico"; // mettre le chemin correct

    // Logo
    const logoEl = document.getElementById("site-logo");
    if (logoEl) logoEl.src = "/images/logo.png"; // mettre le chemin correct

    // Message
    const msgEl = document.getElementById("maintenance-message");
    if (msgEl) msgEl.textContent = "Site undergoing maintenance, we will be back soon.";

    // ⚠️ Stop : aucun fetch ni script supplémentaire
    return;
  }

  // ===============================
  // HELPER : Set image avec fallback
  // ===============================
  function setImageWithErrorHandler(imgElement, src) {
    if (!imgElement || !src) return;
    imgElement.src = src;
    imgElement.onerror = function () {
      if (!this.src.includes("placeholder")) {
        this.src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23F5F5F5' width='200' height='200'/%3E%3Ctext fill='%236A6A6A' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E";
        this.onerror = null;
      }
    };
  }

  // ===============================
  // FETCH SITE SETTINGS
  // ===============================
  fetch("https://avanti-backend-67wk.onrender.com/api/site-settings")
    .then(res => {
      if (!res.ok || res.headers.get("content-type")?.includes("text/html")) return {};
      return res.json().catch(() => ({}));
    })
    .then(settings => {
      if (!settings || Object.keys(settings).length === 0) return;

      // Redirection maintenance côté production
      if (settings.maintenance_mode) {
        console.warn("Maintenance mode active, redirecting to coming-soon.html");
        window.location.href = "coming-soon.html";
        return;
      }

      // Titre, favicon, logo
      const title = document.getElementById("site-title");
      if (title) title.textContent = settings.site_name;

      const favicon = document.getElementById("favicon");
      if (favicon) favicon.href = settings.favicon_path;

      const logo = document.getElementById("site-logo");
      if (logo && settings.logo_path) setImageWithErrorHandler(logo, settings.logo_path);

      // Footer logo
      const footerLogo = document.querySelector(".footer-logo img");
      if (footerLogo && settings.logo_path) setImageWithErrorHandler(footerLogo, settings.logo_path);
    })
    .catch(err => console.error("Erreur Loading site settings:", err));

  // ===============================
  // FETCH HOME BANNERS
  // ===============================
  fetch("https://avanti-backend-67wk.onrender.com/api/home-banners")
    .then(res => {
      if (!res.ok || res.headers.get("content-type")?.includes("text/html")) return [];
      return res.json().catch(() => []);
    })
    .then(banners => {
      if (!Array.isArray(banners) || banners.length === 0) return;
      const slides = document.querySelectorAll("#bannerCarouselControls .carousel-item .banner-slide");
      slides.forEach((slide, index) => {
        const banner = banners[index];
        if (!banner) return;
        slide.style.backgroundImage = `url('${banner.image_path}')`;
        slide.style.backgroundSize = "cover";
        slide.style.backgroundPosition = "center";

        let btn = slide.querySelector(".primary_btn");
        if (!btn && banner.button_text && banner.button_url) {
          const container = slide.querySelector(".container") || document.createElement("div");
          container.classList.add("container", "text-center");
          btn = document.createElement("a");
          btn.classList.add("primary_btn");
          container.appendChild(btn);
          slide.appendChild(container);
        }
        if (btn && banner.button_text && banner.button_url) {
          btn.textContent = banner.button_text;
          btn.href = banner.button_url;
          btn.style.display = "inline-block";
        }
      });
    })
    .catch(err => console.error("Erreur Loading home banners:", err));

  // ===============================
  // FETCH DISCOUNT SECTION
  // ===============================
  fetch("https://avanti-backend-67wk.onrender.com/api/discount-sections")
    .then(res => {
      if (!res.ok || res.headers.get("content-type")?.includes("text/html")) return [];
      return res.json().catch(() => []);
    })
    .then(data => {
      if (!data || data.length < 3) return;
      const img1 = document.querySelector(".discount-image1 img");
      const img2 = document.querySelector(".discount-image2 img");
      const img3 = document.querySelector(".discount-image3 img");
      if (img1) setImageWithErrorHandler(img1, data[0].image_path);
      if (img2) setImageWithErrorHandler(img2, data[1].image_path);
      if (img3) setImageWithErrorHandler(img3, data[2].image_path);

      document.querySelector(".content1 h6").innerText = data[0].title;
      document.querySelector(".content2 h6").innerText = data[1].title;
      document.querySelector(".content3 h6").innerText = data[2].title;

      document.querySelector(".content1 .text span").innerHTML = data[0].description;
      document.querySelector(".content2 .text span").innerHTML = data[1].description;
      document.querySelector(".content3 .text span").innerHTML = data[2].description;

      if (data[1].button_text) {
        const btn2 = document.querySelector(".content2 .primary_btn");
        if (btn2) { btn2.innerText = data[1].button_text; btn2.href = data[1].button_url; }
      }
      if (data[2].button_text) {
        const btn3 = document.querySelector(".content3 .primary_btn");
        if (btn3) { btn3.innerText = data[2].button_text; btn3.href = data[2].button_url; }
      }
    })
    .catch(err => console.error("Erreur Loading discount sections:", err));

  // ===============================
  // FETCH CHOOSE SECTION
  // ===============================
  fetch("https://avanti-backend-67wk.onrender.com/api/choose-section")
    .then(res => {
      if (!res.ok || res.headers.get("content-type")?.includes("text/html")) return {};
      return res.json().catch(() => ({}));
    })
    .then(data => {
      if (!data || !data.section || !data.benefits) return;

      document.querySelector(".choose_content h6").innerText = data.section.subtitle;
      document.querySelector(".choose_content h2").innerText = data.section.title;
      document.querySelector(".choose_content p").innerText = data.section.description;

      const benefitBoxes = document.querySelectorAll(".beneft-box");
      data.benefits.forEach((benefit, index) => {
        if (!benefitBoxes[index]) return;
        benefitBoxes[index].querySelector("h5").innerHTML = benefit.title;
        benefitBoxes[index].querySelector("p").innerText = benefit.description;
      });
    })
    .catch(err => console.error("Erreur Loading choose section:", err));

  // ===============================
  // FETCH CATEGORIES + PRODUCTS
  // ===============================
  Promise.all([
    fetch("https://avanti-backend-67wk.onrender.com/api/product-categories")
      .then(res => (!res.ok || res.headers.get("content-type")?.includes("text/html") ? [] : res.json().catch(() => []))),
    fetch("https://avanti-backend-67wk.onrender.com/api/products")
      .then(res => (!res.ok || res.headers.get("content-type")?.includes("text/html") ? [] : res.json().catch(() => [])))
  ])
    .then(([categories, products]) => {
      if (!Array.isArray(categories) || !Array.isArray(products)) return;

      const tabLinks = document.querySelectorAll(".nav-tabs li a");
      tabLinks.forEach((tab, index) => {
        if (categories[index]) {
          tab.innerText = categories[index].name;
          tab.setAttribute("href", `#${categories[index].slug}`);
        }
      });

      categories.forEach(category => {
        const tabPane = document.getElementById(category.slug);
        if (!tabPane) return;

        const boxes = tabPane.querySelectorAll(".feature-box");
        const categoryProducts = products.filter(p => p.category_slug === category.slug);

        categoryProducts.forEach((product, index) => {
          if (!boxes[index]) return;
          const img = boxes[index].querySelector("img");
          if (img && product.image_path) setImageWithErrorHandler(img, product.image_path);
          boxes[index].querySelector("h4").innerText = product.name;
          boxes[index].querySelector(".price1").innerText = product.description;
        });
      });
    })
    .catch(err => console.error("Erreur Loading categories & products:", err));

  // ===============================
  // FOOTER DYNAMIQUE
  // ===============================
  const footerSection = document.querySelector(".footer-con");
  if (footerSection) {
    // Contacts
    fetch("https://avanti-backend-67wk.onrender.com/api/footer/contacts")
      .then(res => (!res.ok || res.headers.get("content-type")?.includes("text/html") ? { success: false, data: null } : res.json().catch(() => ({ success: false, data: null }))))
      .then(result => {
        if (!result.success || !result.data) return;
        const data = result.data;

        const phoneEl = footerSection.querySelector(".icon li i.fa-phone")?.parentElement.querySelector("a");
        const emailEl = footerSection.querySelector(".icon li i.fa-envelope")?.parentElement.querySelector("a");
        const addressEl = footerSection.querySelector(".icon li i.fa-location-dot")?.parentElement.querySelector("a");

        if (phoneEl) { phoneEl.textContent = data.phone; phoneEl.href = `tel:${data.phone}`; }
        if (emailEl) { emailEl.textContent = data.email; emailEl.href = `mailto:${data.email}`; }
        if (addressEl) { addressEl.textContent = data.address; }
      })
      .catch(err => console.error("Erreur contacts footer:", err));

    // Social Links
    fetch("https://avanti-backend-67wk.onrender.com/api/footer/social-links")
      .then(res => (!res.ok || res.headers.get("content-type")?.includes("text/html") ? { success: false, data: [] } : res.json().catch(() => ({ success: false, data: [] }))))
      .then(result => {
        if (!result.success || !result.data) return;
        const socialContainer = footerSection.querySelector(".social-icons");
        if (!socialContainer) return;

        socialContainer.innerHTML = "";
        result.data.forEach(link => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link.url;
          a.target = "_blank";
          a.classList.add("text-decoration-none");
          a.innerHTML = `<i class="fa-brands ${link.icon} social-networks"></i>`;
          li.appendChild(a);
          socialContainer.appendChild(li);
        });
      })
      .catch(err => console.error("Erreur social links footer:", err));
  }

});


// Contacts html
document.addEventListener("DOMContentLoaded", () => {

  fetch("https://avanti-backend-67wk.onrender.com/api/site-contact")
    .then(res => {
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        console.warn('Site contact API returned HTML instead of JSON');
        return { success: false, data: null };
      }
      return res.json().catch(() => ({ success: false, data: null }));
    })
    .then(res => {
      if (!res.success || !res.data) return;

      const data = res.data;

      /* Adresse */
      const addressEl = document.getElementById("contact-address");
      if (addressEl) {
        addressEl.textContent = data.address_text;
        addressEl.href = data.address_url;
      }

      /* Téléphones */
      const phoneContainer = document.getElementById("contact-phones");
      if (phoneContainer) {
        phoneContainer.innerHTML = "";
        (data.phone_numbers || []).forEach(phone => {
          phoneContainer.innerHTML += `
            <a href="tel:${phone}" class="d-block">${phone}</a>
          `;
        });
      }

      /* Emails */
      const emailContainer = document.getElementById("contact-emails");
      if (emailContainer) {
        emailContainer.innerHTML = "";
        (data.emails || []).forEach(email => {
          emailContainer.innerHTML += `
            <a href="mailto:${email}" class="d-block">${email}</a>
          `;
        });
      }

      /* Map */
      const mapIframe = document.getElementById("contact-map");
      if (mapIframe && data.map_url) {
        mapIframe.src = data.map_url;
      }
    })
    .catch(err => console.error("Erreur contact page:", err));
});


// -------------------------------
// DYNAMISE LES BLOGS
// -------------------------------
fetch("https://avanti-backend-67wk.onrender.com/api/blogs")
  .then(res => {
    if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
      console.warn('Blogs API returned HTML instead of JSON');
      return { success: false, data: [] };
    }
    return res.json().catch(() => ({ success: false, data: [] }));
  })
  .then(data => {
    if (!data.success || !data.data || data.data.length === 0) return;
    const blogs = data.data;

    // Mini-blog sections sur la page d'Home
    const blogSections = document.querySelectorAll(".mini-blog-section");
    blogSections.forEach((section, index) => {
      const blog = blogs[index];
      if (!blog) return;

      // Image
      const img = section.querySelector("img");
      if (img && blog.image_url) setImageWithErrorHandler(img, blog.image_url);

      // Date
      const dateEl = section.querySelector(".blog-date");
      if (blog.publish_date && dateEl) {
        const d = new Date(blog.publish_date + 'T00:00:00');
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        dateEl.textContent = d.toLocaleDateString('en-EN', options);
      }

      // Titre et description courte
      const title = section.querySelector(".blog-title");
      if (title) title.textContent = blog.title;

      const desc = section.querySelector(".blog-short-description");
      if (desc) desc.textContent = blog.short_description;

      // Lien vers page blog
      const link = section.querySelector(".read-more");
      if (link) link.href = `single-bloc.html?slug=${blog.slug}`;


      // Tags dynamiques (si existants)
      const tagsContainer = section.querySelector(".blog-tags");
      if (tagsContainer && blog.blogs_post_tags) {
        tagsContainer.innerHTML = "";
        blog.blogs_post_tags.forEach(tag => {
          const span = document.createElement("span");
          span.classList.add("blog-tag");
          span.textContent = tag.name;
          tagsContainer.appendChild(span);
        });
      }

      // "À la une" (featured)
      if (blog.featured) {
        section.classList.add("featured-blog");
      }
    });
  })
  .catch(err => console.error("Error loading blogs:", err));


// -------------------------------
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const blogsContainer = document.getElementById("blogs-container");
  const tabs = document.querySelectorAll("#myTab .nav-link");

  if (!blogsContainer) return;

  /**
   * Récupérer un paramètre depuis l'URL
   */
  function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

  /**
   * Charger les blogs par catégorie et/ou tag
   */
  function loadBlogs(categorySlug = null, tagSlug = null) {
    blogsContainer.innerHTML = "<p>Loading...</p>";

    let url = "https://avanti-backend-67wk.onrender.com/api/blogs";
    const params = [];

    if (categorySlug) {
      params.push(`category=${encodeURIComponent(categorySlug)}`);
    }

    if (tagSlug) {
      params.push(`tag=${encodeURIComponent(tagSlug)}`);
    }

    if (params.length) {
      url += "?" + params.join("&");
    }

    fetch(url)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          console.warn('Blogs API returned HTML instead of JSON');
          return { success: false, data: [] };
        }
        return res.json().catch(() => ({ success: false, data: [] }));
      })
      .then(data => {
        if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
          blogsContainer.innerHTML = "<p>No items available</p>";
          return;
        }

        blogsContainer.innerHTML = "";

        data.data.forEach(blog => {
          const date = blog.publish_date
            ? new Date(blog.publish_date).toLocaleDateString("en-EN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
            : "";

          const articleHTML = `
            <div class="single-blog-box">
              <figure class="mb-0">
                <img src="${blog.single_image}" alt="${blog.title}" class="img-fluid">
              </figure>

              <div class="single-blog-details">
                <ul class="list-unstyled">
                  <li class="position-relative"><i class="fas fa-user"></i> Posté par ${blog.author || "Admin"}</li>
                  <li class="position-relative"><i class="fas fa-calendar-alt"></i> ${date}</li>
                </ul>

                <h4>
                  <a href="/en/single-blog.html?slug=${blog.slug}">
                    ${blog.title}
                  </a>
                </h4>

                <p>${blog.short_description || ""}</p>

                <div class="generic-btn2">
                  <a href="/en/single-blog.html?slug=${blog.slug}">
                    Read more
                  </a>
                </div>
              </div>
            </div>
          `;

          blogsContainer.insertAdjacentHTML("beforeend", articleHTML);
        });
      })
      .catch(err => {
        console.error("Erreur Loading blogs :", err);
        blogsContainer.innerHTML = "<p>Erreur lors du Loading des articles</p>";
      });
  }

  /**
   * Gestion des clics sur les tabs catégories
   */
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener("click", e => {
        e.preventDefault();

        const slug = tab.dataset.slug;
        if (!slug) return;

        // Active state
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Reset l'URL (on enlève ?tag)
        history.pushState(null, "", "/en/blog.html");

        // Charger les blogs par catégorie
        loadBlogs(slug, null);
      });
    });
  }

  /**
   * Loading initial (priorité au TAG s'il existe)
   */
  const tagFromUrl = getQueryParam("tag");

  if (tagFromUrl) {
    // Désactiver tous les tabs catégories
    tabs.forEach(t => t.classList.remove("active"));

    // Charger les blogs par tag
    loadBlogs(null, tagFromUrl);
  } else if (tabs.length) {
    // Charger la catégorie active par défaut
    const defaultTab =
      document.querySelector("#myTab .nav-link.active") || tabs[0];

    if (defaultTab && defaultTab.dataset.slug) {
      defaultTab.classList.add("active");
      loadBlogs(defaultTab.dataset.slug);
    }
  } else {
    // Fallback : charger tous les blogs
    loadBlogs();
  }
});


// === SECTION TAGS SIDEBAR ===
const sidebarTagsEl = document.querySelector(".box4 ul.tag");

if (sidebarTagsEl) {
  const isSingleBlog = window.location.pathname.includes("/en/single-blog.html");
  const isSingleRecipe = window.location.pathname.includes("/en/single-recipe.html");

  const baseLink = isSingleRecipe
    ? "/en/recette.html"
    : "/en/blog.html"; // fallback par défaut blog

  fetch("https://avanti-backend-67wk.onrender.com/api/tags/en")
    .then(res => {
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        console.warn('Tags API returned HTML instead of JSON');
        return { success: false, data: [] };
      }
      return res.json().catch(() => ({ success: false, data: [] }));
    })
    .then(data => {
      if (!data.success || !data.data) return;

      sidebarTagsEl.innerHTML = "";

      data.data.forEach(tag => {
        sidebarTagsEl.innerHTML += `
          <li>
            <a href="${baseLink}?tag=${tag.slug}" class="button text-decoration-none">
              ${tag.name}
            </a>
          </li>
        `;
      });
    })
    .catch(err => console.error("Erreur récupération tags:", err));
}


 

// -------------------------------
// DYNAMISE LES CATEGORIES DE BLOG
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const tabIds = [
    "tab-1",
    "tab-2",
    "tab-3",
    "tab-4",
    "tab-5",
    "tab-6"
  ]; // ID des <a> dans ton HTML correspondant aux tabs

  try {
    const res = await fetch("https://avanti-backend-67wk.onrender.com/api/blog-categories");
    const data = await res.json();

    if (!data.success || !Array.isArray(data.data)) return;

    // On ne garde que les 6 premières
    const categories = data.data.slice(0, 6);

    categories.forEach((category, index) => {
      const tab = document.getElementById(tabIds[index]);
      if (!tab) return;

      // Mettre à jour le texte
      tab.textContent = category.name;

      // Mettre à jour le lien pour filtrer les blogs
      tab.href = `/en/blog.html?category=${category.slug}`;
    });
  } catch (err) {
    console.error("Erreur récupération catégories de blog :", err);
  }
});



// =======================================================
// HOME PAGE – PRODUITS (/en/index.html)
// =======================================================
document.addEventListener("DOMContentLoaded", async () => {
  const productTabs = document.querySelectorAll("#productTabs .nav-link");
  const productBoxes = document.querySelectorAll(".feature-box");

  if (!productTabs.length || !productBoxes.length) return;

  /* ===============================
     Charger dynamiquement les catégories
     =============================== */
  try {
    const res = await fetch("https://avanti-backend-67wk.onrender.com/api/en/product-categories?limit=5");
    const data = await res.json();

    if (!data.success || !Array.isArray(data.data)) return;

    const categories = data.data.slice(0, 5);

    categories.forEach((category, index) => {
      const tab = productTabs[index];
      if (!tab) return;

      // Mettre à jour le texte et le data-slug du tab
      tab.textContent = category.name;
      tab.dataset.slug = category.slug;

      // Mettre le href pour que l'URL soit correcte
      tab.href = `/en/index.html?category=${category.slug}`;

      // Activer le premier tab par défaut
      if (index === 0) tab.classList.add("active");
      else tab.classList.remove("active");
    });
  } catch (err) {
    console.error("Erreur Loading catégories produits :", err);
  }

  /* ===============================
     Fonction pour charger les produits
     =============================== */
  function loadProductsByCategory(slug) {
    fetch(`https://avanti-backend-67wk.onrender.com/api/products?category=${encodeURIComponent(slug)}&limit=6`)
      .then(res => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          console.warn('Products API returned HTML instead of JSON');
          return { success: false, data: [] };
        }
        return res.json().catch(() => ({ success: false, data: [] }));
      })
      .then(response => {
        if (!response.success || !Array.isArray(response.data)) return;

        productBoxes.forEach(box => {
          box.closest(".col-lg-4").style.display = "none";
        });

        response.data.forEach((product, index) => {
          const box = productBoxes[index];
          if (!box) return;

          box.closest(".col-lg-4").style.display = "block";

          const img = box.querySelector(".feature-image img");
          if (img && product.image_path) {
            setImageWithErrorHandler(img, product.image_path);
            img.alt = product.name;
          }

          const title = box.querySelector(".lower_content h4");
          if (title) title.textContent = product.name;

          const link = box.querySelector(".lower_content a");
          if (link) link.href = `/en/product-detail.html?slug=${product.slug}`;

          const priceBox = box.querySelector(".price");
          if (priceBox) {
            priceBox.innerHTML = `<span class="price1">${product.description || "Description not available"}</span>`;
          }
        });
      })
      .catch(err => console.error("Erreur Loading produits :", err));
  }

  /* ===============================
     Gestion du clic sur les tabs
     =============================== */
  productTabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();

      productTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Charger les produits de cette catégorie
      loadProductsByCategory(tab.dataset.slug);

      // Mettre l'URL à jour sans recharger la page
      history.replaceState(null, "", `/en/index.html?category=${tab.dataset.slug}`);
    });
  });

  /* ===============================
     Loading initial
     =============================== */
  // Vérifier si une catégorie est présente dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromURL = urlParams.get("category");
  const initialTab = Array.from(productTabs).find(
    tab => tab.dataset.slug === categoryFromURL
  ) || document.querySelector("#productTabs .nav-link.active") || productTabs[0];

  if (initialTab) loadProductsByCategory(initialTab.dataset.slug);
});



// =======================================================
// PAGE DETAILS – PRODUITS (/en/product-detail.html)
// =======================================================

document.addEventListener("DOMContentLoaded", async () => {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) return;

  try {
    const res = await fetch(`https://avanti-backend-67wk.onrender.com/api/products/slug?slug=${encodeURIComponent(slug)}`);
    const data = await res.json();
    if (!data.success || !data.data.length) return;
    const product = data.data[0];

    // 1. Nom et description
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productDescription").textContent = product.description || "Description not available";

    // 2. Images principales
    const images = [product.image_path, product.image_2, product.image_3, product.image_4].filter(Boolean);
    images.forEach((src, idx) => {
      const imgEl = document.getElementById(`productImage${idx + 1}`);
      if (imgEl) setImageWithErrorHandler(imgEl, src);
    });

    // 3. Vignettes
    const thumbs = document.querySelectorAll(".tab-thumb");
    thumbs.forEach((thumb, idx) => {
      if (images[idx]) setImageWithErrorHandler(thumb, images[idx]);
    });

  } catch (err) {
    console.error("Erreur Loading produit :", err);
  }
});


//

document.addEventListener("DOMContentLoaded", async () => {
  const featureBoxes = document.querySelectorAll(".feature-box");
  if (!featureBoxes.length) return;

  try {
    // Récupérer les produits
    const res = await fetch("https://avanti-backend-67wk.onrender.com/api/products?limit=8");
    if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
      console.warn('Products API returned HTML instead of JSON');
      return;
    }
    const data = await res.json().catch(() => ({ success: false, data: [] }));
    if (!data.success || !Array.isArray(data.data)) return;

    const products = data.data;

    featureBoxes.forEach((box, index) => {
      const product = products[index];

      if (!product) {
        // Masquer les boxes en trop
        const item = box.closest(".item");
        if (item) item.style.display = "none";
        return;
      }

      // Image principale
      const imgEl = box.querySelector(".feature-image img");
      if (imgEl && product.image_path) {
        setImageWithErrorHandler(imgEl, product.image_path);
        imgEl.alt = product.name;
      }

      // Nom du produit
      const titleEl = box.querySelector(".lower_content h4");
      if (titleEl) titleEl.textContent = product.name;

      // Description ou prix dans le bloc price
      const priceEl = box.querySelector(".price");
      if (priceEl) {
        priceEl.innerHTML = `<span class="price1">${product.description || "Description not available"}</span>`;
      }

      // Lien vers la page produit
      const linkEl = box.querySelector(".image .icon a[href*='/en/contact.html'], .image .icon a[href*='/en/index.html']");
      if (linkEl) linkEl.href = `/en/product-detail.html?slug=${product.slug}`;
    });
  } catch (err) {
    console.error("Erreur Loading Autres Produits :", err);
  }
});


// -------------------------------
// DYNAMISE LES CATEGORIES DE RECETTES
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const tabIds = [
    "cat-1",
    "cat-2",
    "cat-3",
    "cat-4",
    "cat-5",
    "cat-6"
  ]; // IDs des <a> pour les tabs

  try {
    // 1️⃣ Récupérer les catégories de recettes
    const res = await fetch("https://avanti-backend-67wk.onrender.com/api/recipes/recipe-categories?limit=6");
    const data = await res.json();

    if (!data.success || !Array.isArray(data.data)) return;

    const categories = data.data;

    // 2️⃣ Remplir les tabs dynamiquement
    categories.forEach((category, index) => {
      const tab = document.getElementById(tabIds[index]);
      if (!tab) return;

      tab.textContent = category.name;
      tab.dataset.slug = category.slug; // stocker le slug pour filtrage
      tab.href = `/en/recette.html?category=${category.slug}`; // lien (optionnel)
    });

    // 3️⃣ Ajouter le click handler pour filtrer les recettes
    categories.forEach((category, index) => {
      const tab = document.getElementById(tabIds[index]);
      if (!tab) return;

      tab.addEventListener("click", async (e) => {
        e.preventDefault();

        // Activer le tab cliqué
        tabIds.forEach(id => document.getElementById(id)?.classList.remove("active"));
        tab.classList.add("active");

        // Charger les recettes de cette catégorie
        await loadRecipesByCategory(category.slug);

        // Mettre à jour l'URL
        history.replaceState(null, "", `/en/recette.html?category=${category.slug}`);
      });
    });

    // 4️⃣ Loading initial : catégorie depuis l'URL ou premier tab
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get("category");
    const initialCategory = categoryFromURL || categories[0]?.slug;
    if (initialCategory) await loadRecipesByCategory(initialCategory);

  } catch (err) {
    console.error("Erreur récupération catégories de recettes :", err);
  }

  /**
   * Charger les recettes d'une catégorie
   */
  async function loadRecipesByCategory(slug) {
    const container = document.getElementById("recipes-container");
    if (!container) return;

    container.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch(`https://avanti-backend-67wk.onrender.com/api/recipes/category/${encodeURIComponent(slug)}`);
      const data = await res.json();

      if (!data.success || !data.data?.recipes?.length) {
        container.innerHTML = "<p>No recipe available</p>";
        return;
      }

      container.innerHTML = "";

      data.data.recipes.forEach(recipe => {
        const date = recipe.created_at
          ? new Date(recipe.created_at).toLocaleDateString("en-EN", { day: "2-digit", month: "long", year: "numeric" })
          : "";

        const html = `
          <div class="single-recipe-box">
            <figure class="mb-0">
              <img src="${recipe.image_url}" alt="${recipe.title}" class="img-fluid">
            </figure>

            <div class="single-blog-details">
              <ul class="list-unstyled">
              <li class="position-relative"><i class="fa-solid fa-star"></i>
               <i class="fa-solid fa-star"></i>
               <i class="fa-solid fa-star"></i>
               <i class="fa-regular fa-star"></i>
               <i class="fa-regular fa-star"></i></li>
              <li class="position-relative"><i class="fa-solid fa-utensils"></i></i> For 02 persons</li>
              </ul>

              <h4>
                <a href="/en/single-recipe.html?slug=${recipe.slug}" class="button text-decoration-none">
                  ${recipe.title}
                </a>
              </h4>

              <p>${recipe.short_description || ""}</p>

              <div class="generic-btn2">
                <a href="/en/single-recipe.html?slug=${recipe.slug}">
                  See the recipe
                </a>
              </div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
      });
    } catch (err) {
      console.error("Erreur Loading recettes :", err);
      container.innerHTML = "<p>Erreur serveur</p>";
    }
  }
});


// =======================================================
// SINGLE RECIPE PAGE (/en/single-recipe.html)
// =======================================================

document.addEventListener("DOMContentLoaded", () => {

  console.log("✅ single-recipe.js chargé");

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  console.log("🔎 Slug extrait :", slug);

  if (!slug) {
    console.error("❌ Slug manquant");
    return;
  }

  const API_BASE = "https://avanti-backend-67wk.onrender.com/api";
  let CURRENT_RECIPE_ID = null;

  fetch(`${API_BASE}/recipes/en/${slug}`)
    .then(res => {
      if (!res.ok || res.headers.get("content-type")?.includes("text/html")) {
        console.warn("⚠️ Single recipe API returned HTML instead of JSON");
        return { success: false, data: null };
      }
      return res.json().catch(() => ({ success: false, data: null }));
    })
    .then(data => {
      console.log("📦 API RAW:", data);

      if (!data.success || !data.data) {
        console.error("❌ Pas de données retournées par l'API");
        return;
      }
 
      const { recipe, tags, comments, related } = data.data;
      CURRENT_RECIPE_ID = recipe.id; // ✅ stocké pour les commentaires
      // Injecter dans blog-comments.js si disponible
      if (window.setCurrentRecipeId) {
        window.setCurrentRecipeId(CURRENT_RECIPE_ID);
      }

      if (!recipe) {
        console.error("❌ Recette non trouvée dans la réponse");
        return;
      }


      // ===================== TAGS DE LA RECETTE =====================
      const recipeTagsEl = document.querySelector(".single-recipe-tags");

      if (recipeTagsEl) {
        recipeTagsEl.innerHTML = "";

        if (tags?.length) {
          tags.forEach(tag => {
            recipeTagsEl.innerHTML += `
        <li>
          <a href="/en/recette.html?tag=${tag.slug}" class="button text-decoration-none">
            ${tag.name}
          </a>
        </li>
      `;
          });
        } else {
          recipeTagsEl.innerHTML = "<li>No associated tags</li>";
        }
      }


      // ===================== IMAGE PRINCIPALE =====================
      const mainImage = document.getElementById("recipe-main-image");
      if (mainImage && recipe.image) {
        mainImage.src = recipe.image;
        mainImage.alt = recipe.title || "Image recette";

        console.log("🖼️ Image SRC injecté :", mainImage.src);
      }

      // ===================== TITRE =====================
      const titleEl = document.getElementById("recipe-title");
      if (titleEl) titleEl.textContent = recipe.title || "Recette";

      // ===================== AUTEUR =====================
      const authorEl = document.getElementById("recipe-author");
      if (authorEl) authorEl.textContent = recipe.author || "Avanti";

      // ===================== META (ex: pour X personnes) =====================
      const metaEl = document.getElementById("recipe-meta");
      if (metaEl) {
        metaEl.textContent = recipe.servings
          ? `Pour ${recipe.servings} persons`
          : "Avanti Recipe";
      }

      // ===================== INTRO =====================
      const introEl = document.getElementById("recipe-intro");
      if (introEl) introEl.innerHTML = recipe.short_description || "";

      // ===================== PARAGRAPHE 1 =====================
      const paragraph1El = document.getElementById("recipe-paragraph-1");
      if (paragraph1El) paragraph1El.textContent = recipe.paragraph_1 || "";

      // ===================== PARAGRAPHE 2 =====================
      const paragraph2El = document.getElementById("recipe-paragraph-2");
      if (paragraph2El) paragraph2El.textContent = recipe.paragraph_2 || "";

      // ===================== COMMENTAIRES =====================
      const commentsEl = document.getElementById("recipe-comments");
      if (commentsEl) {
        commentsEl.innerHTML = "";

        if (comments?.length) {
          comments.forEach(c => {
            commentsEl.innerHTML += `
              <div class="comment-single">
                <h5>${c.name}</h5>
                <span>${new Date(c.created_at).toLocaleDateString("en-EN")}</span>
                <p>${c.comment}</p>
              </div>
            `;
          });
        } else {
          commentsEl.innerHTML = "<p>No comments yet</p>";
        }
      }

      // ===================== RECETTES SIMILAIRES =====================
      const relatedEl = document.getElementById("recipe-related");
      if (relatedEl) {
        relatedEl.innerHTML = "";

        if (related?.length) {
          related.forEach(r => {
            relatedEl.innerHTML += `
              <li class="mb-3">
                <div class="feed">
                  <img src="${r.image}" class="img-fluid" alt="${r.title}">
                  <a href="/en/single-recipe.html?slug=${r.slug}">${r.title}</a>
                </div>
              </li>
            `;
          });
        } else {
          relatedEl.innerHTML = "<li>No similar recipes</li>";
        }
      }

      console.log("✅ Recette chargée avec succès");
    })
    .catch(err => console.error("❌ Erreur fetch recette :", err));
});


