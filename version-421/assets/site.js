(function () {
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) {
      return;
    }
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('[data-menu-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      var target = document.getElementById(button.getAttribute('data-menu-toggle'));
      if (target) {
        target.classList.toggle('is-open');
      }
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var copies = Array.prototype.slice.call(document.querySelectorAll('.hero-copy-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      copies.forEach(function (copy, i) {
        copy.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  document.querySelectorAll('.movie-search').forEach(function (input) {
    var targetSelector = input.getAttribute('data-search-target') || '.movie-grid';
    var target = document.querySelector(targetSelector);
    var empty = document.querySelector(input.getAttribute('data-empty-target') || '');
    if (!target) {
      return;
    }
    var cards = Array.prototype.slice.call(target.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' ').toLowerCase();
        var matched = keyword === '' || text.indexOf(keyword) !== -1;
        card.classList.toggle('hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    });
  });
})();

function initMoviePlayer(source) {
  var video = document.getElementById('movieVideo');
  var overlay = document.getElementById('playerOverlay');
  var button = document.getElementById('playerButton');
  if (!video || !overlay || !source) {
    return;
  }
  var hls = null;
  var prepared = false;
  function prepare() {
    if (prepared) {
      return;
    }
    prepared = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }
  function play() {
    prepare();
    overlay.classList.add('is-hidden');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  }
  overlay.addEventListener('click', play);
  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      play();
    });
  }
  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });
  video.addEventListener('pause', function () {
    if (!video.ended) {
      overlay.classList.remove('is-hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
