// script.js
// Consolidated script for video behavior and navigation

document.addEventListener('DOMContentLoaded', () => {
  // Simple play helper for any video with id 'carvideo'
  window.playvideo = function playvideo() {
    const v = document.getElementById('carvideo');
    if (!v) return console.warn('#carvideo not found');
    v.classList.remove('hidden');
    v.play().catch(err => console.warn('play blocked', err));
  };

  // uploadReel helper (if you have an <input id="upload"> and .reel-container)
  window.uploadReel = function uploadReel() {
    const fileInput = document.getElementById('upload');
    if (!fileInput) return alert('Upload input not found');
    const file = fileInput.files[0];
    if (!file) return alert('Please select a video');

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.style.width = '300px';
    video.style.height = '500px';
    video.style.borderRadius = '20px';

    const container = document.querySelector('.reel-container');
    if (!container) return alert('No .reel-container in DOM');
    container.prepend(video);
  };

  // Navigation: make nav items keyboard-accessible and clickable
  function makeNavLink(id, targetUrl) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => { window.location.href = targetUrl; });
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = targetUrl; } });
  }
  makeNavLink('homeBtn', 'next.html');
  makeNavLink('aboutBtn', 'index.html#about');

  // IG-style single video (#igVideo)
  const igVideo = document.getElementById('igVideo');
  const muteToggle = document.getElementById('muteToggle');
  const playOverlay = document.getElementById('playOverlay');
  if (igVideo) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          igVideo.play().catch(err => console.warn('play blocked', err));
          playOverlay && playOverlay.classList.add('hidden');
        } else {
          igVideo.pause();
          playOverlay && playOverlay.classList.remove('hidden');
        }
      });
    }, { threshold: [0, 0.5, 1] });
    io.observe(igVideo);

    igVideo.addEventListener('click', async () => {
      if (igVideo.muted) {
        try { igVideo.muted = false; await igVideo.play(); muteToggle && (muteToggle.textContent = '🔊'); }
        catch (e) { console.warn(e); igVideo.muted = true; }
      } else { igVideo.muted = true; muteToggle && (muteToggle.textContent = '🔇'); }
    });

    muteToggle && muteToggle.addEventListener('click', e => {
      e.stopPropagation();
      if (igVideo.muted) { igVideo.muted = false; igVideo.play().catch(() => {}); muteToggle.textContent = '🔊'; }
      else { igVideo.muted = true; muteToggle.textContent = '🔇'; }
    });

    igVideo.addEventListener('pause', () => playOverlay && playOverlay.classList.remove('hidden'));
    igVideo.addEventListener('play', () => playOverlay && playOverlay.classList.add('hidden'));
  }

  // Reels viewer logic
  const reelsEl = document.getElementById('reels');
  if (reelsEl) {
    const reels = Array.from(reelsEl.querySelectorAll('.reel'));
    const videos = reels.map(r => r.querySelector('.reel-video'));

    const reelObserver = new IntersectionObserver(entries => {
      entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const top = entries[0];
      if (!top) return;
      const activeReel = top.target;
      videos.forEach(v => { if (v && v !== activeReel.querySelector('.reel-video')) v.pause(); });
      const activeVideo = activeReel.querySelector('.reel-video');
      if (activeVideo) activeVideo.play().catch(e => console.warn('reel play blocked', e));
    }, { threshold: [0.25, 0.5, 0.75, 1] });
    reels.forEach(r => reelObserver.observe(r));

    // Navigation helpers
    let current = 0;
    function scrollToReel(index) {
      index = Math.max(0, Math.min(reels.length - 1, index));
      current = index;
      reels[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { scrollToReel(current + 1); e.preventDefault(); }
      if (e.key === 'ArrowUp') { scrollToReel(current - 1); e.preventDefault(); }
    });

    let wheelTimeout = null;
    window.addEventListener('wheel', e => {
      if (wheelTimeout) return;
      if (e.deltaY > 20) scrollToReel(current + 1);
      else if (e.deltaY < -20) scrollToReel(current - 1);
      wheelTimeout = setTimeout(() => wheelTimeout = null, 250);
    }, { passive: true });

    let touchStartY = null;
    window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', e => {
      if (touchStartY === null) return;
      const dy = (e.changedTouches[0].clientY - touchStartY);
      if (dy < -50) scrollToReel(current + 1);
      else if (dy > 50) scrollToReel(current - 1);
      touchStartY = null;
    }, { passive: true });
  }

});