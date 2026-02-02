// ==========================================
// POSITIONS DES OBJETS COLLECTABLES
// ==========================================
// Définit les coordonnées de spawn de chaque objet dans le monde du jeu
// Facilite l'ajustement des positions sans toucher au code principal

export const ITEMS_POSITIONS = {
  // ===== COFFRE MAGIQUE (objet final) =====
  coffre: {
    x: 1000,  // Position horizontale (en pixels)
    y: -100,  // Position verticale (en pixels)
  },
  
  // ===== CLÉ MYSTÉRIEUSE (nécessaire pour ouvrir le coffre) =====
  cle: {
    x: 200,   // Position horizontale (en pixels)
    y: 20,    // Position verticale (en pixels)
  },
  
  // ===== PARCHEMIN (Lettre de motivation) =====
  parchemin: {
    x: 1130,  // Position horizontale (en pixels)
    y: 650,   // Position verticale (en pixels)
  },
};