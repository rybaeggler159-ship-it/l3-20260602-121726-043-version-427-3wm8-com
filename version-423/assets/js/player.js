(function () {
  var box = document.querySelector('[data-player]');
  if (!box) {
    return;
  }

  var video = box.querySelector('video');
  var button = box.querySelector('.play-layer');
  var source = box.getAttribute('data-src');
  var hlsInstance = null;

  function bindSource() {
    if (video.getAttribute('data-ready') === '1') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    video.setAttribute('data-ready', '1');
  }

  function start() {
    bindSource();
    box.classList.add('is-playing');
    video.controls = true;
    var playTask = video.play();
    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {
        box.classList.remove('is-playing');
      });
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}());
