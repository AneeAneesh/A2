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

function uploadReel() {
  const fileInput = document.getElementById('upload');
  const file = fileInput.files[0];
  if (!file) return alert("Please select a video");

  const video = document.createElement('video');
  video.src = URL.createObjectURL(file);
  video.controls = true;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.style.width = "300px";
  video.style.height = "500px";
  video.style.borderRadius = "20px";

  document.querySelector('.reel-container').prepend(video);