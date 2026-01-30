// ==========================================
// AUDIO MANAGER - GESTION GLOBALE DU SON
// ==========================================
// Gère toutes les musiques et effets sonores du jeu
// Utilise la bibliothèque Howler.js pour une compatibilité multi-navigateurs

// ==========================================
// DÉCLARATION DES SONS
// ==========================================
const sounds = {
  // Musique du menu principal (boucle infinie)
  menu: new Howl({
    src: ['audio/menuMusic.mp3'],
    loop: true,
    volume: 0.7,
    preload: true,
    onloaderror: (id, error) => {
      console.error('❌ Erreur chargement menu music:', error);
    }
  }),
  
  // Musique du jeu (boucle infinie, volume bas)
  game: new Howl({
    src: ['audio/gameMusic.mp3'],
    loop: true,
    volume: 0.02,
    preload: true,
    onloaderror: (id, error) => {
      console.error('❌ Erreur chargement game music:', error);
    }
  }),
  
  // Musique de fin (joue une seule fois)
  end: new Howl({
    src: ['audio/endMusic.mp3'],
    loop: false,
    volume: 0.2,
    preload: true,
    onloaderror: (id, error) => {
      console.error('❌ Erreur chargement end music:', error);
    }
  }),
  
  // Effet sonore : collecte d'objet
  itemCollect: new Howl({
    src: ['audio/item-collected.wav'],
    volume: 0.1,
    preload: true,
    onloaderror: (id, error) => {
      console.error('❌ Erreur chargement item sound:', error);
    }
  })
};

// ==========================================
// VOLUMES PAR DÉFAUT (pour les transitions)
// ==========================================
const DEFAULT_VOLUMES = {
  menu: 0.7,
  game: 0.02,
  end: 0.2,
  itemCollect: 0.1
};

// ==========================================
// ÉTAT DE L'AUDIO
// ==========================================
// Les navigateurs bloquent l'autoplay audio par défaut
// Il faut un clic utilisateur pour déverrouiller
let audioUnlocked = false;

// Musique actuellement en cours de lecture
let currentMusic = null; // 'menu', 'game', 'end', null

// ==========================================
// GESTIONNAIRE AUDIO PRINCIPAL
// ==========================================
const audioManager = {
  // ==========================================
  // DÉVERROUILLER L'AUDIO
  // ==========================================
  // Les navigateurs modernes exigent une interaction utilisateur
  // avant de jouer du son (politique autoplay)
  unlockAudio() {
    if (audioUnlocked) return;
    
    const testSound = sounds.menu;
    
    // Écouter l'événement de déverrouillage de Howler
    testSound.once('unlock', () => {
      audioUnlocked = true;
    });
    
    // Technique pour forcer le unlock : play puis pause immédiatement
    testSound.play();
    testSound.pause();
    
    // Fallback : si l'événement 'unlock' ne se déclenche pas après 100ms
    setTimeout(() => {
      if (!audioUnlocked) {
        audioUnlocked = true;
      }
    }, 100);
  },
  
  // ==========================================
  // INITIALISER LE DÉVERROUILLAGE AUTOMATIQUE
  // ==========================================
  // S'attache au premier clic/touch de l'utilisateur
  // Déverrouille l'audio ET lance la musique du menu
  initAutoUnlock() {
    const unlockAndPlay = () => {
      this.unlockAudio();
      // Jouer la musique du menu après le déverrouillage
      setTimeout(() => {
        this.playMenuMusic();
      }, 150);
    };
    
    // Attacher aux événements, une seule fois (once: true)
    document.addEventListener('click', unlockAndPlay, { once: true });
    document.addEventListener('touchstart', unlockAndPlay, { once: true });
  },
  
  // ==========================================
  // JOUER LA MUSIQUE DU MENU
  // ==========================================
  playMenuMusic() {
    // Filet de sécurité : vérifier si déjà en cours
    if (currentMusic === 'menu' && sounds.menu.playing()) return;
    
    // Filet de sécurité : vérifier que l'audio est déverrouillé
    if (!audioUnlocked) return;
    
    // Arrêter les autres musiques avant de lancer
    if (sounds.game.playing()) sounds.game.stop();
    if (sounds.end.playing()) sounds.end.stop();
    
    // Démarrer avec un fade in
    sounds.menu.volume(0);
    sounds.menu.play();
    sounds.menu.fade(0, DEFAULT_VOLUMES.menu, 500);
    
    currentMusic = 'menu';
  },
  
  // ==========================================
  // JOUER LA MUSIQUE DU JEU
  // ==========================================
  // Arrête la musique du menu avec fade out
  // Lance celle du jeu avec fade in
  playGameMusic() {
    // Filet de sécurité : vérifier si déjà en cours
    if (currentMusic === 'game' && sounds.game.playing()) return;
    
    // Fade out du menu (si en cours)
    if (sounds.menu.playing()) {
      const currentVolume = sounds.menu.volume();
      sounds.menu.fade(currentVolume, 0, 500);
      
      // Attendre la fin du fade out avant de stopper
      sounds.menu.once('fade', () => {
        sounds.menu.stop();
      });
    }
    
    // Fade in du jeu après un court délai
    setTimeout(() => {
      sounds.game.volume(0);
      sounds.game.play();
      sounds.game.fade(0, DEFAULT_VOLUMES.game, 500);
      currentMusic = 'game';
    }, 100);
  },
  
  // ==========================================
  // JOUER LA MUSIQUE DE FIN
  // ==========================================
  // Arrête la musique du jeu avec fade out
  // Lance celle de fin avec fade in
  playEndMusic() {
    // Filet de sécurité : vérifier si déjà en cours
    if (currentMusic === 'end' && sounds.end.playing()) return;
    
    // Fade out du jeu (si en cours)
    if (sounds.game.playing()) {
      const currentVolume = sounds.game.volume();
      sounds.game.fade(currentVolume, 0, 500);
      
      // Attendre la fin du fade out avant de stopper
      sounds.game.once('fade', () => {
        sounds.game.stop();
      });
    }
    
    // Fade in de la musique de fin après un court délai
    setTimeout(() => {
      sounds.end.volume(0);
      sounds.end.play();
      sounds.end.fade(0, DEFAULT_VOLUMES.end, 500);
      currentMusic = 'end';
    }, 100);
  },
  
  // ==========================================
  // RETOUR AU MENU
  // ==========================================
  // Arrête toutes les musiques sauf celle du menu
  backToMenu() {
    // Filet de sécurité : vérifier si déjà sur le menu
    if (currentMusic === 'menu' && sounds.menu.playing()) return;
    
    // Arrêter les musiques en cours (sans fade car retour rapide)
    sounds.game.stop();
    sounds.end.stop();
    
    // Relancer la musique du menu avec fade in
    sounds.menu.volume(0);
    sounds.menu.play();
    sounds.menu.fade(0, DEFAULT_VOLUMES.menu, 500);
    
    currentMusic = 'menu';
  },
  
  // ==========================================
  // EFFET SONORE : COLLECTE D'OBJET
  // ==========================================
  playItemSound() {
    // Filet de sécurité : vérifier que l'audio est déverrouillé
    if (!audioUnlocked) return;
    
    // Les effets sonores peuvent être joués plusieurs fois simultanément
    sounds.itemCollect.play();
  },
  
  // ==========================================
  // ARRÊTER TOUS LES SONS
  // ==========================================
  stopAll() {
    sounds.menu.stop();
    sounds.game.stop();
    sounds.end.stop();
    currentMusic = null;
  },
  
  // ==========================================
  // BASCULER MUET/SON
  // ==========================================
  // Active/désactive le son global via Howler
  toggleMute() {
    Howler.mute(!Howler._muted);
    return Howler._muted;
  }
};

// ==========================================
// INITIALISATION AU CHARGEMENT DU MODULE
// ==========================================
audioManager.initAutoUnlock();

export default audioManager;