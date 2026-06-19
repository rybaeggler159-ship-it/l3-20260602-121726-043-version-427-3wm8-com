(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function initHeader() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initBrokenImages() {
        document.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.style.opacity = "0";
            }, { once: true });
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        var prev = slider.querySelector("[data-hero-prev]");
        var next = slider.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function getQueryValue(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || "";
    }

    function initFilters() {
        var root = document.querySelector("[data-filter-root]");
        if (!root) {
            return;
        }
        var search = root.querySelector("[data-filter-search]");
        var category = root.querySelector("[data-filter-category]");
        var year = root.querySelector("[data-filter-year]");
        var region = root.querySelector("[data-filter-region]");
        var type = root.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
        var initialQuery = getQueryValue("q");
        if (search && initialQuery) {
            search.value = initialQuery;
        }

        function match(card, attr, value) {
            if (!value) {
                return true;
            }
            return (card.getAttribute(attr) || "") === value;
        }

        function apply() {
            var q = search ? search.value.trim().toLowerCase() : "";
            var selectedCategory = category ? category.value : "";
            var selectedYear = year ? year.value : "";
            var selectedRegion = region ? region.value : "";
            var selectedType = type ? type.value : "";
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-text") || "").toLowerCase();
                var visible = true;
                visible = visible && (!q || text.indexOf(q) !== -1);
                visible = visible && match(card, "data-category", selectedCategory);
                visible = visible && match(card, "data-year", selectedYear);
                visible = visible && match(card, "data-region", selectedRegion);
                visible = visible && match(card, "data-type", selectedType);
                card.classList.toggle("is-hidden", !visible);
            });
        }

        [search, category, year, region, type].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener("input", apply);
            control.addEventListener("change", apply);
        });
        apply();
    }

    function initPlayers() {
        document.querySelectorAll("[data-player]").forEach(function (frame) {
            var video = frame.querySelector("video");
            var button = frame.querySelector("[data-play-button]");
            if (!video || !button) {
                return;
            }
            var stream = video.getAttribute("data-stream") || "";
            var bound = false;
            var hlsInstance = null;

            function bindStream() {
                if (bound || !stream) {
                    return;
                }
                bound = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: false });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }
            }

            function startPlay() {
                bindStream();
                video.controls = true;
                frame.classList.add("is-playing");
                var playTask = video.play();
                if (playTask && typeof playTask.catch === "function") {
                    playTask.catch(function () {
                        frame.classList.remove("is-playing");
                    });
                }
            }

            button.addEventListener("click", function (event) {
                event.preventDefault();
                startPlay();
            });
            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlay();
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    }

    ready(function () {
        initHeader();
        initBrokenImages();
        initHero();
        initFilters();
        initPlayers();
    });
})();
