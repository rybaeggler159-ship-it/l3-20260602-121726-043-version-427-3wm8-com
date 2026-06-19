(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var nextButton = hero.querySelector('.hero-arrow.next');
    var prevButton = hero.querySelector('.hero-arrow.prev');
    var index = 0;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function next() {
      show(index + 1);
    }

    if (nextButton) {
      nextButton.addEventListener('click', next);
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        show(index - 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    window.setInterval(next, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.movie-search'));
  var yearFilters = Array.prototype.slice.call(document.querySelectorAll('.year-filter'));
  var typeFilters = Array.prototype.slice.call(document.querySelectorAll('.type-filter'));

  function activeValue(list) {
    var value = '';
    list.forEach(function (item) {
      if (item.value) {
        value = item.value.toLowerCase();
      }
    });
    return value;
  }

  function filterCards() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    if (!cards.length) {
      return;
    }
    var query = activeValue(searchInputs);
    var year = activeValue(yearFilters);
    var type = activeValue(typeFilters);
    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-genre') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-category') || '',
        card.innerText || ''
      ].join(' ').toLowerCase();
      var matchQuery = !query || haystack.indexOf(query) > -1;
      var matchYear = !year || (card.getAttribute('data-year') || '').toLowerCase() === year;
      var matchType = !type || (card.getAttribute('data-type') || '').toLowerCase().indexOf(type) > -1;
      card.classList.toggle('is-hidden', !(matchQuery && matchYear && matchType));
    });
  }

  searchInputs.concat(yearFilters).concat(typeFilters).forEach(function (control) {
    control.addEventListener('input', filterCards);
    control.addEventListener('change', filterCards);
  });

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q');
  if (query && searchInputs.length) {
    searchInputs[0].value = query;
    filterCards();
  }

  Array.prototype.slice.call(document.querySelectorAll('.site-search')).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      if (!value) {
        return;
      }
      if (searchInputs.length) {
        searchInputs[0].value = value;
        filterCards();
        var target = document.querySelector('.filter-panel') || document.querySelector('.movie-grid');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.location.href = 'categories.html?q=' + encodeURIComponent(value);
      }
    });
  });
}());
