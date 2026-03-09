// ==========================================
// CLASSE BOUNDARY - ZONES DE COLLISION
// ==========================================
// Représente une zone invisible de collision (murs, obstacles)
// Empêche le joueur de traverser certaines zones de la carte

export class Boundary {
  // ===== PROPRIÉTÉS STATIQUES =====
  // Dimensions standard d'une tuile (utilisées pour le placement sur la grille)
  static width = 48;   // Largeur d'une tuile en pixels
  static height = 48;  // Hauteur d'une tuile en pixels

  /**
   * Crée une nouvelle zone de collision
   * @param {Object} position - Position {x, y} de la zone
   */
  constructor({ position }) {
    this.position = position;
    
    // ===== DIMENSIONS DE LA ZONE DE COLLISION =====
    // Plus petites que la tuile (48x48) pour un effet de collision plus naturel
    // Le joueur peut "frôler" les bords sans être bloqué
    this.width = 34;   // Largeur réelle de collision (34 < 48)
    this.height = 28;  // Hauteur réelle de collision (28 < 48)
  }

  // ==========================================
  // DESSINER LA ZONE (POUR LE DEBUG)
  // ==========================================
  /**
   * Affiche la zone de collision (invisible en production, utile pour le debug)
   * @param {CanvasRenderingContext2D} c - Contexte du canvas
   */
  draw(c) {
    // Rectangle rouge complètement transparent (invisible)
    // Pour le debug, on peut changer l'opacité à 0.5 pour voir les zones
    c.fillStyle = "rgba(255, 0, 0, 0)"; // Rouge transparent (alpha = 0)
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}