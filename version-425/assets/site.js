(function() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      panel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function(slide, current) {
      slide.classList.toggle('active', current === activeIndex);
    });

    dots.forEach(function(dot, current) {
      dot.classList.toggle('active', current === activeIndex);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function() {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var filterList = document.querySelector('[data-filter-list]');

  function applyFilter() {
    if (!filterList) {
      return;
    }

    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

    cards.forEach(function(card) {
      var text = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-tags') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-year') || ''
      ].join(' ').toLowerCase();
      var yearMatches = !year || card.getAttribute('data-year') === year;
      var keywordMatches = !keyword || text.indexOf(keyword) !== -1;

      card.classList.toggle('hidden-card', !(yearMatches && keywordMatches));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }
})();
