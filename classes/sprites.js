// ==========================================
// CLASSE SPRITE - GESTION DES IMAGES ANIMÉES
// ==========================================
// Gère l'affichage et l'animation des sprites (personnages, objets, décors)
// Supporte les spritesheets (images contenant plusieurs frames d'animation)

export class Sprite {
  /**
   * Crée un nouveau sprite
   * @param {Object} position - Position {x, y} du sprite
   * @param {Image} image - Objet Image à afficher
   * @param {Object} frames - Nombre de frames d'animation {max: nombre}
   * @param {Object} sprites - Sprites alternatifs (pour différentes directions)
   * @param {number|null} width - Largeur personnalisée (optionnel)
   * @param {number|null} height - Hauteur personnalisée (optionnel)
   * @param {number} scale - Facteur d'échelle (1 = taille normale)
   */
  constructor({ position, image, frames = { max: 1 }, sprites, width = null, height = null, scale = 1 }) {
    // ===== PROPRIÉTÉS DE BASE =====
    this.position = position;  // Position {x, y} dans le monde
    this.image = image;        // Image source du sprite
    this.sprites = sprites;    // Sprites alternatifs (animations directionnelles)
    this.moving = false;       // Le sprite est-il en mouvement ?
    this.scale = scale;        // Facteur d'agrandissement/réduction

    // ===== GESTION DES FRAMES D'ANIMATION =====
    this.frames = { 
      ...frames,      // Nombre maximum de frames
      val: 0,         // Frame actuelle affichée (0 à max-1)
      elapsed: 0      // Compteur de frames écoulées (pour ralentir l'animation)
    };

    // ===== DIMENSIONS PERSONNALISÉES =====
    // Stocker les dimensions personnalisées si fournies
    // (utile pour forcer une taille spécifique indépendante de l'image)
    this.customWidth = width;
    this.customHeight = height;

    // Initialiser avec des dimensions par défaut (48x48 pixels)
    this.width = width || 48;
    this.height = height || 48;

    // ===== CALCUL AUTOMATIQUE DES DIMENSIONS =====
    // Une fois l'image chargée, recalculer les dimensions si nécessaire
    this.image.onload = () => {
      // Ne recalculer que si aucune dimension personnalisée n'est fournie
      if (!this.customWidth) {
        // Largeur = largeur totale de l'image divisée par le nombre de frames
        this.width = this.image.width / this.frames.max;
      }
      if (!this.customHeight) {
        // Hauteur = hauteur de l'image source
        this.height = this.image.height;
      }
    };
  }

  // ==========================================
  // DESSINER LE SPRITE SUR LE CANVAS
  // ==========================================
  /**
   * Affiche le sprite sur le canvas et gère l'animation
   * @param {CanvasRenderingContext2D} c - Contexte 2D du canvas
   */
  draw(c) {
    // ===== CALCUL DES DIMENSIONS D'AFFICHAGE =====
    // Utiliser les dimensions personnalisées si disponibles, sinon calculer
    const displayWidth = this.customWidth || Math.floor(this.image.width / this.frames.max);
    const displayHeight = this.customHeight || this.image.height;
    
    // Largeur d'une frame dans la spritesheet source
    const frameWidth = Math.floor(this.image.width / this.frames.max);

    // ===== DESSINER LA FRAME ACTUELLE =====
    c.drawImage(
      this.image,                        // Image source
      this.frames.val * frameWidth,      // Position X dans la spritesheet (frame actuelle)
      0,                                 // Position Y dans la spritesheet (toujours 0)
      frameWidth,                        // Largeur de la frame à découper
      this.image.height,                 // Hauteur de la frame à découper
      this.position.x,                   // Position X d'affichage sur le canvas
      this.position.y,                   // Position Y d'affichage sur le canvas
      displayWidth * this.scale,         // Largeur d'affichage finale (avec scale)
      displayHeight * this.scale         // Hauteur d'affichage finale (avec scale)
    );

    // ===== GESTION DE L'ANIMATION =====
    // Si le sprite ne bouge pas, ne pas animer
    if (!this.moving) return;

    // Si le sprite a plusieurs frames d'animation
    if (this.frames.max > 1) {
      // Incrémenter le compteur de frames écoulées
      this.frames.elapsed++;
      
      // Changer de frame toutes les 9 frames (ralentit l'animation)
      if (this.frames.elapsed % 9 === 0) {
        // Passer à la frame suivante
        if (this.frames.val < this.frames.max - 1) {
          this.frames.val++;
        } else {
          // Revenir à la première frame (boucle l'animation)
          this.frames.val = 0;
        }
      }
    }
  }
}