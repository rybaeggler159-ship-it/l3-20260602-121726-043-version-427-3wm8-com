(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            var isOpen = mobilePanel.hasAttribute("hidden") === false;
            if (isOpen) {
                mobilePanel.setAttribute("hidden", "");
                menuButton.setAttribute("aria-expanded", "false");
            } else {
                mobilePanel.removeAttribute("hidden");
                menuButton.setAttribute("aria-expanded", "true");
            }
        });
    }

    var hero = document.querySelector(".hero-carousel");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    var list = document.querySelector("[data-filter-list]");
    var searchInput = document.querySelector("[data-filter-input]");
    var yearSelect = document.querySelector("[data-year-select]");
    var emptyTip = document.querySelector(".empty-tip");

    function applyFilter() {
        if (!list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var searchText = (card.getAttribute("data-search") || "").toLowerCase();
            var cardYear = card.getAttribute("data-year") || "";
            var hitKeyword = keyword === "" || searchText.indexOf(keyword) >= 0;
            var hitYear = year === "" || cardYear === year;
            var shouldShow = hitKeyword && hitYear;
            card.style.display = shouldShow ? "" : "none";
            if (shouldShow) {
                visible += 1;
            }
        });

        if (emptyTip) {
            emptyTip.style.display = visible === 0 ? "block" : "none";
        }
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query) {
            searchInput.value = query;
        }
        searchInput.addEventListener("input", applyFilter);
    }

    if (yearSelect) {
        yearSelect.addEventListener("change", applyFilter);
    }

    applyFilter();
})();
