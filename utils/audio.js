const sounds = {
  menu: new Howl({
    src: ["audio/menuMusic.mp3"],
    loop: true,
    volume: 0.7,
    preload: true,
  }),
  game: new Howl({
    src: ["audio/gameMusic.mp3"],
    loop: true,
    volume: 0.02,
    preload: true,
  }),
  end: new Howl({
    src: ["audio/endMusic.mp3"],
    loop: false,
    volume: 0.2,
    preload: true,
  }),
  itemCollect: new Howl({
    src: ["audio/item-collected.wav"],
    volume: 0.1,
    preload: true,
  }),
  outro: new Howl({
    src: ["audio/outroMusic.mp3"],
    loop: false,
    volume: 0.2,
    preload: true,
  }),
};

const DEFAULT_VOLUMES = { menu: 0.7, game: 0.02, end: 0.2, itemCollect: 0.1 };

let audioUnlocked = false;
let currentMusic = null;

const audioManager = {
  unlockAudio() {
    if (audioUnlocked) return;
    sounds.menu.once("unlock", () => {
      audioUnlocked = true;
    });
    sounds.menu.play();
    sounds.menu.pause();
    setTimeout(() => {
      if (!audioUnlocked) audioUnlocked = true;
    }, 100);
  },

  initAutoUnlock() {
    const unlock = () => {
      this.unlockAudio();
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
  },

  playMenuMusic() {
    if (currentMusic === "menu" && sounds.menu.playing()) return;
    if (!audioUnlocked) this.unlockAudio();
    if (sounds.game.playing()) sounds.game.stop();
    if (sounds.end.playing()) sounds.end.stop();
    sounds.menu.volume(0);
    sounds.menu.play();
    sounds.menu.fade(0, DEFAULT_VOLUMES.menu, 500);
    currentMusic = "menu";
  },

  playGameMusic() {
    if (currentMusic === "game" && sounds.game.playing()) return;
    if (sounds.menu.playing()) {
      sounds.menu.fade(sounds.menu.volume(), 0, 500);
      sounds.menu.once("fade", () => {
        sounds.menu.stop();
      });
    }
    setTimeout(() => {
      sounds.game.volume(0);
      sounds.game.play();
      sounds.game.fade(0, DEFAULT_VOLUMES.game, 500);
      currentMusic = "game";
    }, 100);
  },

  playEndMusic() {
    if (currentMusic === "end" && sounds.end.playing()) return;
    if (sounds.game.playing()) {
      sounds.game.fade(sounds.game.volume(), 0, 500);
      sounds.game.once("fade", () => {
        sounds.game.stop();
      });
    }
    setTimeout(() => {
      sounds.end.volume(0);
      sounds.end.play();
      sounds.end.fade(0, DEFAULT_VOLUMES.end, 500);
      currentMusic = "end";
    }, 100);
  },

  backToMenu() {
    if (currentMusic === "menu" && sounds.menu.playing()) return;
    sounds.game.stop();
    sounds.end.stop();
    sounds.menu.volume(0);
    sounds.menu.play();
    sounds.menu.fade(0, DEFAULT_VOLUMES.menu, 500);
    currentMusic = "menu";
  },

  playItemSound() {
    if (!audioUnlocked) return;
    sounds.itemCollect.play();
  },

  stopAll() {
    sounds.menu.stop();
    sounds.game.stop();
    sounds.end.stop();
    currentMusic = null;
  },

  toggleMute() {
    Howler.mute(!Howler._muted);
    return Howler._muted;
  },
  playOutroSound() {
    if (!audioUnlocked) this.unlockAudio();
    sounds.outro.play();
  },
};

audioManager.initAutoUnlock();

export default audioManager;
