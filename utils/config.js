// ============================================
// CONFIGURATION GLOBALE DU JEU
// ============================================

/**
 * Objet de configuration contenant toutes les constantes du jeu
 * Centralise les paramètres pour faciliter les ajustements
 */
export const CONFIG = {
  // ===== DIMENSIONS DU CANVAS =====
  // Largeur du canvas de jeu en pixels
  CANVAS_WIDTH: 1024,
  // Hauteur du canvas de jeu en pixels
  CANVAS_HEIGHT: 576,

  // ===== GAMEPLAY =====
  // Vitesse de déplacement du joueur en pixels par frame
  SPEED: 4,

  // ===== CARTE DE COLLISION =====
  // Largeur de la carte de collision en tuiles
  COLLISION_MAP_WIDTH: 70,

  // ===== POSITIONNEMENT DE LA CARTE =====
  // Décalage (offset) pour centrer la carte sur le canvas
  // x: décalage horizontal négatif (la carte commence plus à gauche)
  // y: décalage vertical négatif (la carte commence plus en haut)
  OFFSET: { x: -748, y: -650 },
};