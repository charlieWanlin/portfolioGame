// ==========================================
// GESTION DES CONTRÔLES CLAVIER
// ==========================================

import audioManager from "./audio.js";
import { overlayManager, inventory } from "./instances.js";
import { handleInteraction } from "./interactions.js";

// ===== ÉTAT DES TOUCHES DIRECTIONNELLES =====
// Objet qui stocke l'état pressé/relâché de chaque touche de mouvement
export const keys = {
  z: { pressed: false }, // Haut
  q: { pressed: false }, // Gauche
  s: { pressed: false }, // Bas
  d: { pressed: false }, // Droite
};

// ===== VARIABLES D'ÉTAT DU JEU =====
// État actuel du jeu (sera mis à jour par main.js)
let currentGameState = "PLAYING";
// Objet avec lequel le joueur peut interagir (NPC, coffre, etc.)
let currentNearbyObject = null;

// ===== RÉFÉRENCES AUX BOUTONS GAMEBOY =====
// Boutons A et B de l'interface Gameboy
let boutonA = null;
let boutonB = null;

// ========================================
// METTRE À JOUR LE CONTEXTE DU JEU
// ========================================
/**
 * Met à jour l'état du jeu et l'objet proche du joueur
 * Appelé depuis main.js à chaque frame
 * 
 * @param {string} gameState - État actuel du jeu ("PLAYING", "PAUSED", etc.)
 * @param {Object|null} nearbyObject - Objet interactif à proximité du joueur
 */
export function updateGameContext(gameState, nearbyObject) {
  currentGameState = gameState;
  currentNearbyObject = nearbyObject;
}

// ========================================
// INITIALISER LES ÉVÉNEMENTS CLAVIER ET BOUTONS
// ========================================
/**
 * Configure tous les événements de contrôle (clavier et boutons UI)
 * Appelé au démarrage du jeu
 */
export function initKeyboardControls() {
  // Récupération des boutons A et B depuis le DOM
  boutonA = document.querySelector('[data-bouton="a"]');
  boutonB = document.querySelector('[data-bouton="b"]');

  // ===== ÉVÉNEMENTS CLAVIER =====
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // ===== ÉVÉNEMENTS BOUTON A (souris + tactile) =====
  if (boutonA) {
    // Gestion clic souris (PC)
    boutonA.addEventListener("click", handleAButton);
    // Gestion tactile (mobile)
    boutonA.addEventListener("touchstart", (e) => {
      e.preventDefault(); // Empêche le comportement par défaut du tactile
      handleAButton();
    });
  }

  // ===== ÉVÉNEMENTS BOUTON B (souris + tactile) =====
  if (boutonB) {
    // Gestion clic souris (PC)
    boutonB.addEventListener("click", handleBButton);
    // Gestion tactile (mobile)
    boutonB.addEventListener("touchstart", (e) => {
      e.preventDefault(); // Empêche le comportement par défaut du tactile
      handleBButton();
    });
  }
}

// ========================================
// GESTION TOUCHE ENFONCÉE
// ========================================
/**
 * Gère l'appui sur une touche du clavier
 * Bloque les déplacements si un overlay est ouvert
 * 
 * @param {KeyboardEvent} e - Événement clavier
 */
function handleKeyDown(e) {
  switch (e.key.toLowerCase()) {
    case "z": // Touche Z = Déplacement vers le haut
      if (overlayManager.estOuvert()) return; // Bloque si overlay ouvert
      keys.z.pressed = true;
      break;
    case "q": // Touche Q = Déplacement vers la gauche
      if (overlayManager.estOuvert()) return; // Bloque si overlay ouvert
      keys.q.pressed = true;
      break;
    case "s": // Touche S = Déplacement vers le bas
      if (overlayManager.estOuvert()) return; // Bloque si overlay ouvert
      keys.s.pressed = true;
      break;
    case "d": // Touche D = Déplacement vers la droite
      if (overlayManager.estOuvert()) return; // Bloque si overlay ouvert
      keys.d.pressed = true;
      break;
    case "a": // Touche A = Action/Interaction
      e.preventDefault();
      handleAButton();
      break;
    case "b": // Touche B = Action secondaire
      e.preventDefault();
      handleBButton();
      break;
  }
}

// ========================================
// GESTION TOUCHE RELÂCHÉE
// ========================================
/**
 * Gère le relâchement d'une touche du clavier
 * Arrête le mouvement dans la direction correspondante
 * 
 * @param {KeyboardEvent} e - Événement clavier
 */
function handleKeyUp(e) {
  switch (e.key.toLowerCase()) {
    case "z":
      keys.z.pressed = false;
      break;
    case "q":
      keys.q.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
}

// ========================================
// GESTION BOUTON A
// ========================================
/**
 * Gère l'action du bouton A
 * - Si overlay ouvert : valide le choix A ou ferme l'overlay
 * - Sinon : interagit avec l'objet proche
 */
function handleAButton() {
  // ===== CAS 1 : UN OVERLAY EST OUVERT =====
  if (overlayManager.estOuvert()) {
    // Si des choix multiples sont disponibles
    if (overlayManager.currentChoices && overlayManager.currentChoices.length > 0) {
      // Recherche du choix associé à la touche A
      const choixA = overlayManager.currentChoices.find(choice => choice.key === "A");
      if (choixA) {
        // ⚠️ NOTE : L'action "curtain-end" (coffre ouvert) ne lance PAS la musique de fin
        // Seule l'action "curtain" (bouton B, pilule rouge) la lance
        overlayManager.handleChoice(choixA.action);
      }
    } else {
      // Aucun choix multiple : ferme l'overlay
      overlayManager.fermerTous();
    }
    return;
  }

  // ===== CAS 2 : INTERACTION NORMALE AVEC LES OBJETS =====
  // Si le jeu est en cours ET qu'un objet est à proximité
  if (currentGameState === "PLAYING" && currentNearbyObject !== null) {
    handleInteraction(currentNearbyObject);
  }
}

// ========================================
// GESTION BOUTON B
// ========================================
/**
 * Gère l'action du bouton B
 * - Si overlay ouvert avec choix multiples : valide le choix B
 * - Lance la musique de fin pour l'action "curtain" (pilule rouge)
 */
function handleBButton() {
  // ===== CAS : UN OVERLAY EST OUVERT =====
  if (overlayManager.estOuvert()) {
    // Si au moins 2 choix sont disponibles
    if (overlayManager.currentChoices && overlayManager.currentChoices.length > 1) {
      // Recherche du choix associé à la touche B
      const choixB = overlayManager.currentChoices.find(choice => choice.key === "B");
      
      if (choixB) {
        // ✅ MUSIQUE DE FIN : Lance uniquement pour la pilule rouge (action "curtain")
        if (choixB.action === "curtain") {
          audioManager.playEndMusic();
        }
        
        // Exécute l'action du choix B
        overlayManager.handleChoice(choixB.action);
      }
      return;
    }
  }
}