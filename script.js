// script.js
function playvideo() {
  const video = document.getElementById('carvideo');
  if (!video) {
    console.error('Video element (#carvideo) not found');
    return;
  }

  // Try to play (returns a Promise in modern browsers)
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // playing started
        console.log('Video playing');
      })
      .catch(err => {
        // play() was blocked (autoplay policy) or another error
        console.warn('Unable to play video automatically:', err);
      });
  }
}

// optional: hook up the button instead of inline onclick
document.getElementById('playBtn')?.addEventListener('click', playvideo);

// optional: hook up the button instead of inline onclick
document.getElementById('playBtn')?.addEventListener('click', playvideo);
function togglePlay() {
  const video = document.getElementById('carvideo');
  if (!video) return;
  if (video.paused) {
    video.play().catch(e => console.warn(e));
  } else {
    video.pause();
  }
}
document.getElementById('playBtn')?.addEventListener('click', togglePlay);
function togglePlay() {
  const video = document.getElementById('carvideo');
  if (!video) return;
  if (video.paused) {
    video.play().catch(e => console.warn(e));
  } else {
    video.pause();
  }
}
document.getElementById('playBtn')?.addEventListener('click', togglePlay);
function playvideo() {
  const video = document.getElementById('carvideo');
  if (!video) return;
  video.classList.remove('hidden'); // if you need to show it
  video.play().catch(err => console.warn('play blocked', err));
}