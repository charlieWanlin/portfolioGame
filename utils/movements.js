// ==========================================
// INITIALISATION DES CONTRÔLES DE MOUVEMENT
// ==========================================

import { overlayManager } from "./instances.js";

/**
 * Configure les événements pour les boutons directionnels de la Gameboy
 * Gère à la fois les contrôles souris (PC) et tactiles (mobile)
 * Bloque le mouvement si un overlay est ouvert
 * 
 * @param {NodeList} btns - Liste des boutons directionnels (up, down, left, right)
 * @param {Object} keys - Objet contenant l'état des touches (z, q, s, d)
 */
export function initMovements(btns, keys) {
  btns.forEach((btn) => {
    
    // ==========================================
    // ÉVÉNEMENTS SOURIS (PC)
    // ==========================================
    
    btn.addEventListener("mousedown", (e) => {
      if (overlayManager.estOuvert()) return;
      e.preventDefault();
      const direction = btn.dataset.direction;
      
      if (direction === "up") keys.z.pressed = true;
      if (direction === "down") keys.s.pressed = true;
      if (direction === "left") keys.q.pressed = true;
      if (direction === "right") keys.d.pressed = true;
    });

    btn.addEventListener("mouseup", (e) => {
      e.preventDefault();
      const direction = btn.dataset.direction;
      
      if (direction === "up") keys.z.pressed = false;
      if (direction === "down") keys.s.pressed = false;
      if (direction === "left") keys.q.pressed = false;
      if (direction === "right") keys.d.pressed = false;
    });

    // ==========================================
    // ÉVÉNEMENTS TACTILES (MOBILE)
    // ==========================================
    
    btn.addEventListener("touchstart", (e) => {
      if (overlayManager.estOuvert()) return;
      e.preventDefault();
      const direction = btn.dataset.direction;
      
      if (direction === "up") keys.z.pressed = true;
      if (direction === "down") keys.s.pressed = true;
      if (direction === "left") keys.q.pressed = true;
      if (direction === "right") keys.d.pressed = true;
    });

    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      const direction = btn.dataset.direction;
      
      if (direction === "up") keys.z.pressed = false;
      if (direction === "down") keys.s.pressed = false;
      if (direction === "left") keys.q.pressed = false;
      if (direction === "right") keys.d.pressed = false;
    });
  });
}