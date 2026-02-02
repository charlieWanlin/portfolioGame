// ========================================
// MODULE LIGHTBOX GALLERY
// Gestion de la galerie d'images du Making Of
// ========================================

export function initLightboxGallery() {
  let lightbox = null;
  let lightboxImage = null;

  // Créer la lightbox dans le DOM
  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    
    lightboxImage = document.createElement('img');
    lightboxImage.id = 'lightbox-image';
    
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImage);
    document.body.appendChild(lightbox);
    
    // Fermer la lightbox au clic
    lightbox.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Ouvrir la lightbox avec l'image cliquée
  function openLightbox(imageSrc) {
    if (lightbox && lightboxImage) {
      lightboxImage.src = imageSrc;
      lightbox.classList.add('active');
    }
  }

  // Fermer la lightbox
  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
    }
  }

  // Ajouter les événements de clic sur toutes les images
  function attachImageListeners() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(img.src);
      });
    });
  }

  // Initialiser
  function init() {
    if (!lightbox) {
      createLightbox();
    }
    attachImageListeners();
  }

  // Observer l'ouverture du Making Of pour réinitialiser
  function observeMakingOf() {
    const observer = new MutationObserver(() => {
      const makingofOverlay = document.getElementById('makingof-overlay');
      if (makingofOverlay && !makingofOverlay.classList.contains('hidden')) {
        init();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Lancer l'initialisation et l'observation
  init();
  observeMakingOf();
}