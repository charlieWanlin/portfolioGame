const video = document.getElementById('introVideo');

export function lancerIntro() {
  video.currentTime = 0;
  video.style.display = 'block';
  video.muted = false;
  video.play();
}

export function quandIntroFinie(callback) {
  video.addEventListener('ended', () => {
    video.style.display = 'none';
    callback();
  }, { once: true });
}