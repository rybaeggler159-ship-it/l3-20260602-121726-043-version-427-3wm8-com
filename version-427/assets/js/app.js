(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initNav() {
    var header = qs('.site-header');
    var toggle = qs('.nav-toggle');
    if (!header || !toggle) {
      return;
    }
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
    });
  }

  function initHero() {
    var slides = qsa('.hero-slide');
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
        qsa('.hero-dot', slide).forEach(function (dot, dotIndex) {
          dot.classList.toggle('active', dotIndex === index);
        });
      });
    }
    qsa('.hero-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        var next = parseInt(dot.getAttribute('data-slide') || '0', 10);
        show(next);
        restart();
      });
    });
    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    }
    restart();
  }

  function initFilters() {
    var list = qs('.searchable-list');
    if (!list) {
      return;
    }
    var input = qs('.card-filter');
    var type = qs('.type-filter');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) {
      input.value = q;
    }
    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var typeValue = type ? type.value.trim() : '';
      qsa('.movie-card', list).forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-type') || '',
          card.getAttribute('data-genre') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var okText = !keyword || haystack.indexOf(keyword) !== -1;
        var okType = !typeValue || (card.getAttribute('data-type') || '').indexOf(typeValue) !== -1;
        card.classList.toggle('hide-card', !(okText && okType));
      });
    }
    if (input) {
      input.addEventListener('input', apply);
    }
    if (type) {
      type.addEventListener('change', apply);
    }
    apply();
  }

  function initPlayer() {
    var video = qs('#videoPlayer');
    var button = qs('[data-player-button]');
    var shell = qs('.player-shell');
    if (!video || !button || !shell) {
      return;
    }
    var ready = false;
    var hls = null;
    function attach() {
      if (ready) {
        return Promise.resolve();
      }
      var stream = video.getAttribute('data-stream');
      if (!stream) {
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      ready = true;
      return Promise.resolve();
    }
    function start() {
      attach().then(function () {
        shell.classList.add('playing');
        var p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {});
        }
      });
    }
    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!ready) {
        start();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initHero();
    initFilters();
    initPlayer();
  });
})();
