(function () {
  function prepare(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-overlay');
    if (!video || !button) return;

    function start() {
      var media = video.getAttribute('data-media');
      if (!media) return;
      if (box.getAttribute('data-ready') !== '1') {
        box.setAttribute('data-ready', '1');
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = media;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(media);
          hls.attachMedia(video);
        } else {
          video.src = media;
        }
      }
      box.classList.add('playing');
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          box.classList.remove('playing');
        });
      }
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (box.getAttribute('data-ready') !== '1') {
        start();
      }
    });
    video.addEventListener('play', function () {
      box.classList.add('playing');
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(prepare);
})();
