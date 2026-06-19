(function() {
  var form = document.querySelector('.search-page-form');
  var input = document.querySelector('[data-search-page-input]');
  var results = document.querySelector('[data-search-results]');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';

  if (!input || !results || !window.MOVIE_SEARCH_INDEX) {
    return;
  }

  input.value = initialQuery;

  function card(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + movie.url + '" aria-label="' + escapeHtml(movie.title) + ' 在线观看">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-gradient"></span>',
      '    <span class="duration">' + escapeHtml(movie.duration) + '</span>',
      '    <span class="rating">★ ' + escapeHtml(movie.rating) + '</span>',
      '    <span class="play-dot">▶</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p class="meta-line">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</p>',
      '    <p class="one-line">' + escapeHtml(movie.oneLine) + '</p>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function render(query) {
    var q = String(query || '').trim().toLowerCase();

    if (!q) {
      results.innerHTML = '<p class="empty-tip">请输入关键词开始搜索。</p>';
      return;
    }

    var matches = window.MOVIE_SEARCH_INDEX.filter(function(movie) {
      return movie.searchText.indexOf(q) !== -1;
    }).slice(0, 120);

    if (!matches.length) {
      results.innerHTML = '<p class="empty-tip">没有找到相关内容。</p>';
      return;
    }

    results.innerHTML = matches.map(card).join('');
  }

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var query = input.value.trim();
      history.replaceState(null, '', './search.html?q=' + encodeURIComponent(query));
      render(query);
    });
  }

  input.addEventListener('input', function() {
    render(input.value);
  });

  render(initialQuery);
})();
