// ==========================================
// INSTANCES PARTAGÉES (SINGLETONS)
// ==========================================
// Ce fichier centralise les instances uniques partagées dans tout le jeu
// Permet d'éviter les imports circulaires et garantit une seule instance de chaque manager

import OverlayManager from './overlayManager.js';
import Inventory from './inventory.js';

// ===== GESTIONNAIRE D'OVERLAYS =====
// Instance unique pour gérer tous les overlays (dialogues, menus, popups)
// Utilisé par : controls.js, interactions.js, main.js, etc.
export const overlayManager = new OverlayManager();

// ===== GESTIONNAIRE D'INVENTAIRE =====
// Instance unique pour gérer l'inventaire du joueur (objets collectés)
// Utilisé par : interactions.js, main.js, etc.
export const inventory = new Inventory();