(function () {
    var mobileToggle = document.querySelector('[data-mobile-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupLocalFilters() {
        var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

        forms.forEach(function (form) {
            var scopeSelector = form.getAttribute('data-filter-form') || 'body';
            var scope = document.querySelector(scopeSelector) || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
            var empty = scope.querySelector('[data-empty-message]');
            var input = form.querySelector('[name="keyword"]');
            var year = form.querySelector('[name="year"]');
            var region = form.querySelector('[name="region"]');
            var reset = form.querySelector('[data-reset-filter]');

            function apply() {
                var keyword = normalize(input && input.value);
                var yearValue = normalize(year && year.value);
                var regionValue = normalize(region && region.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.dataset.title,
                        card.dataset.genre,
                        card.dataset.tags,
                        card.dataset.type,
                        card.dataset.region,
                        card.dataset.year
                    ].join(' '));
                    var ok = true;

                    if (keyword && haystack.indexOf(keyword) === -1) {
                        ok = false;
                    }
                    if (yearValue && normalize(card.dataset.year) !== yearValue) {
                        ok = false;
                    }
                    if (regionValue && normalize(card.dataset.region).indexOf(regionValue) === -1) {
                        ok = false;
                    }

                    card.classList.toggle('is-hidden', !ok);
                    if (ok) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                apply();
            });

            [input, year, region].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });

            if (reset) {
                reset.addEventListener('click', function () {
                    if (input) {
                        input.value = '';
                    }
                    if (year) {
                        year.value = '';
                    }
                    if (region) {
                        region.value = '';
                    }
                    apply();
                });
            }

            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');
            if (query && input) {
                input.value = query;
            }
            apply();
        });
    }

    var hlsPromise = null;

    function loadHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (hlsPromise) {
            return hlsPromise;
        }
        hlsPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
            script.async = true;
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
        return hlsPromise;
    }

    function attachVideo(video, source) {
        if (!video || !source) {
            return Promise.resolve();
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.load();
            return Promise.resolve();
        }

        return loadHls().then(function (Hls) {
            if (Hls && Hls.isSupported()) {
                var hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video._hls = hls;
                return new Promise(function (resolve) {
                    hls.on(Hls.Events.MANIFEST_PARSED, resolve);
                    window.setTimeout(resolve, 1200);
                });
            }
            video.src = source;
            video.load();
            return Promise.resolve();
        }).catch(function () {
            video.src = source;
            video.load();
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

        players.forEach(function (player) {
            var video = player.querySelector('video');
            var button = player.querySelector('[data-play-button]');
            var cover = player.querySelector('[data-player-cover]');
            var source = player.getAttribute('data-video');
            var attached = false;

            function start() {
                var ready = attached ? Promise.resolve() : attachVideo(video, source);
                attached = true;
                ready.then(function () {
                    player.classList.add('is-playing');
                    video.setAttribute('controls', 'controls');
                    var playResult = video.play();
                    if (playResult && playResult.catch) {
                        playResult.catch(function () {});
                    }
                });
            }

            if (button) {
                button.addEventListener('click', start);
            }
            if (cover) {
                cover.addEventListener('click', start);
            }
            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        start();
                    }
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupHero();
        setupLocalFilters();
        setupPlayers();
    });
})();
