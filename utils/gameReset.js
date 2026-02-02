// ==========================================
// GESTION DE LA RÉINITIALISATION DU JEU
// ==========================================

import { Boundary } from "../classes/boundary.js";
import { CONFIG } from "./config.js";
import { collisions } from "../data/collisions.js";
import audioManager from "./audio.js";
import { resetUI } from "./ui.js";

// ==========================================
// RÉINITIALISER LE JEU ET RETOURNER AU MENU
// ==========================================
export function resetToMenu(
  menu,
  keys,
  background,
  foreground,
  boundaries,
  collisionsMap,
  offset,
  inventory
) {
  // Réinitialiser l'état du menu
  menu.state = "PRINCIPAL";

  // Réinitialiser les touches
  keys.z.pressed = false;
  keys.s.pressed = false;
  keys.q.pressed = false;
  keys.d.pressed = false;

  // Réinitialiser la position de la map (background)
  background.position.x = offset.x;
  background.position.y = offset.y;
  
  // Réinitialiser la position du foreground
  foreground.position.x = offset.x + 432;
  foreground.position.y = offset.y + 150;

  // Réinitialiser la position de toutes les boundaries
  let boundaryIndex = 0;
  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025) {
        boundaries[boundaryIndex].position.x = j * Boundary.width + offset.x;
        boundaries[boundaryIndex].position.y = i * Boundary.height + offset.y;
        boundaryIndex++;
      }
    });
  });

  // Vider l'inventairere
  inventory.viderInventaire();
  
  // Retour à la musique du menu
  // audioManager.backToMenu();

  // Réinitialiser l'interface utilisateur
  resetUI();

  // Retourner null pour signaler que le joueur doit être réinitialisé
  return {
    gameState: "MENU",
    personnageChoisi: null,
    player: null
  };
}