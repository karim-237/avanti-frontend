$(document).ready(function () {
    const $dropdown = $('#lang-dropdown');
    const $button = $('.lang-dropdown');

    const CURRENT_LANG = 'fr';
    const OTHER_LANG = 'en';
    const isFileProtocol = window.location.protocol === 'file:';

    /* ==========================================================================
       Changement de langue (Dynamique & Intelligent)
       ========================================================================== */
    $dropdown.on('click', '.lang-dropdown-item', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.group("🌍 LANG SWITCH DEBUG");
        console.log("Current full URL:", window.location.href);

        const selectedLang = $(this).data('lang');
        console.log("Selected lang:", selectedLang);
        console.log("Current lang (hardcoded):", CURRENT_LANG);

        if (!selectedLang || selectedLang === CURRENT_LANG) {
            console.log("⛔ Same language or invalid selection, abort");
            console.groupEnd();
            return;
        }

        // 1. Récupération des infos de l'URL actuelle
        const urlParams = new URLSearchParams(window.location.search);
        const fileName = window.location.pathname.split('/').pop() || 'index.html';
        const pathName = window.location.pathname;

        // Détection du paramètre de filtrage
        let currentSlug = urlParams.get('slug');
        let currentCat = urlParams.get('category');
        let currentTag = urlParams.get('tag');

        console.log("URL param slug:", currentSlug);
        console.log("URL param category:", currentCat);
        console.log("URL param tag:", currentTag);

        // Détermination du "Type" pour l'API translate-slug
        let type = null;
        let paramKey = null;
        let slugToTranslate = null;

        if (currentSlug) {
            slugToTranslate = currentSlug;
            paramKey = 'slug';
            if (pathName.includes('blog')) type = 'blog';
            else if (pathName.includes('recipe')) type = 'recipe';
            else if (pathName.includes('product')) type = 'product';
        } else if (currentCat) {
            slugToTranslate = currentCat;
            paramKey = 'category';
            if (pathName.includes('blog')) type = 'blog_cat';
            else if (pathName.includes('recipe')) type = 'recipe_cat';
            else if (pathName.includes('product')) type = 'product_cat';
        } else if (currentTag) {
            slugToTranslate = currentTag;
            paramKey = 'tag';
            type = 'tag';
        }

        console.log("Detected slugToTranslate:", slugToTranslate);
        console.log("Detected paramKey:", paramKey);
        console.log("Detected type:", type);

        // 2. Construction de la nouvelle URL (remplacement explicite de la langue)
        let newBaseUrl = "";

        if (isFileProtocol) {
            newBaseUrl = `../${OTHER_LANG}/${fileName}`;
        } else {
            let parts = window.location.pathname.split('/').filter(Boolean);
            const langIndex = parts.indexOf(CURRENT_LANG);
            if (langIndex !== -1) {
                parts[langIndex] = OTHER_LANG;
            }
            newBaseUrl = '/' + parts.join('/');
        }

        console.log("New base URL:", newBaseUrl);

        // 3. Traduction du slug si nécessaire
        if (type && slugToTranslate) {
            try {
                const apiUrl = `https://avanti-backend-67wk.onrender.com/api/translate-slug?slug=${encodeURIComponent(slugToTranslate)}&type=${type}&targetLang=${OTHER_LANG}`;

                console.log("🚀 Fetching translation with:", apiUrl);

                const apiRes = await fetch(apiUrl);
                const data = await apiRes.json();

                console.log("✅ API response:", data);

                if (data.translatedSlug) {
                    const finalUrl = `${newBaseUrl}?${paramKey}=${data.translatedSlug}`;
                    console.log("➡️ Redirecting to:", finalUrl);
                    console.groupEnd();
                    window.location.href = finalUrl;
                } else {
                    console.log("⚠️ No translatedSlug, redirecting without params");
                    console.groupEnd();
                    window.location.href = newBaseUrl;
                }
            } catch (err) {
                console.error("❌ Erreur de traduction d'URL:", err);
                console.groupEnd();
                window.location.href = newBaseUrl;
            }
        } else {
            console.log("ℹ️ No dynamic params detected, normal redirect");
            console.groupEnd();
            window.location.href = newBaseUrl;
        }
    });

    /* ==============================
       Fermeture dropdown
    ============================== */
    $(document).on('click', function (e) {
        if (
            !$dropdown.is(e.target) &&
            $dropdown.has(e.target).length === 0 &&
            !$button.is(e.target) &&
            $button.has(e.target).length === 0
        ) {
            closeDropDown();
        }
    });

    function openDropDown() {
        $dropdown.stop(true, true).slideDown(200).addClass('open');
    }

    function closeDropDown() {
        $dropdown.stop(true, true).slideUp(200).removeClass('open');
    }
});
