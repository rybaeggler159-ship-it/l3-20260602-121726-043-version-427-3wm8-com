(function() {
  const menuButton = document.querySelector("[data-menu-button]");
  const siteNav = document.querySelector("[data-site-nav]");
  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function() {
      siteNav.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const images = Array.from(hero.querySelectorAll("[data-hero-image]"));
    const copies = Array.from(hero.querySelectorAll("[data-hero-copy]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let active = 0;
    function showSlide(index) {
      active = (index + images.length) % images.length;
      images.forEach(function(item, current) {
        item.classList.toggle("is-active", current === active);
      });
      copies.forEach(function(item, current) {
        item.classList.toggle("is-active", current === active);
      });
      dots.forEach(function(item, current) {
        item.classList.toggle("is-active", current === active);
      });
    }
    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        showSlide(index);
      });
    });
    if (images.length > 1) {
      setInterval(function() {
        showSlide(active + 1);
      }, 5000);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get("q") || "";
  const panels = Array.from(document.querySelectorAll("[data-filter-panel]"));
  panels.forEach(function(panel) {
    const keyword = panel.querySelector("[data-filter-keyword]");
    const year = panel.querySelector("[data-filter-year]");
    const type = panel.querySelector("[data-filter-type]");
    const region = panel.querySelector("[data-filter-region]");
    const cards = Array.from(document.querySelectorAll("[data-search-card]"));
    const empty = document.querySelector("[data-empty-state]");
    if (keyword && queryValue) {
      keyword.value = queryValue;
    }
    function normalize(value) {
      return String(value || "").toLowerCase().replace(/\s+/g, "");
    }
    function applyFilters() {
      const key = normalize(keyword ? keyword.value : "");
      const selectedYear = year ? year.value : "";
      const selectedType = type ? type.value : "";
      const selectedRegion = region ? region.value : "";
      let visible = 0;
      cards.forEach(function(card) {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags
        ].join(" "));
        const matchedKey = !key || haystack.indexOf(key) !== -1;
        const matchedYear = !selectedYear || card.dataset.year === selectedYear;
        const matchedType = !selectedType || card.dataset.type === selectedType;
        const matchedRegion = !selectedRegion || card.dataset.region === selectedRegion;
        const matched = matchedKey && matchedYear && matchedType && matchedRegion;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }
    [keyword, year, type, region].forEach(function(control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });
    applyFilters();
  });
})();
