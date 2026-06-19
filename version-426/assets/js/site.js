(function () {
  var header = document.querySelector('.site-header');
  var menu = document.querySelector('.menu-toggle');
  if (menu && header) {
    menu.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-arrow.prev');
  var next = document.querySelector('.hero-arrow.next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startTimer() {
    if (!slides.length) return;
    clearInterval(timer);
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(parseInt(dot.getAttribute('data-slide'), 10) || 0);
      startTimer();
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      startTimer();
    });
  }

  startTimer();

  Array.prototype.slice.call(document.querySelectorAll('.cover-img')).forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-missing');
    });
  });

  var searchInput = document.querySelector('.site-search');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var empty = document.querySelector('.empty-state');
  var quickButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));

  function applyFilter(value) {
    var text = (value || '').trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var hay = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      var match = !text || hay.indexOf(text) !== -1;
      card.hidden = !match;
      if (match) visible += 1;
    });
    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      applyFilter(searchInput.value);
    });
  }

  quickButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-filter') || '';
      if (searchInput) {
        searchInput.value = value;
      }
      applyFilter(value);
    });
  });
})();
