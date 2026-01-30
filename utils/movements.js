// ==========================================
// INITIALISATION DES CONTRÔLES DE MOUVEMENT
// ==========================================
/**
 * Configure les événements pour les boutons directionnels de la Gameboy
 * Gère à la fois les contrôles souris (PC) et tactiles (mobile)
 * 
 * @param {NodeList} btns - Liste des boutons directionnels (up, down, left, right)
 * @param {Object} keys - Objet contenant l'état des touches (z, q, s, d)
 */
export function initMovements(btns, keys) {
  // Parcourir chaque bouton directionnel
  btns.forEach((btn) => {
    
    // ===== ÉVÉNEMENTS SOURIS (PC) =====
    
    // Appui souris : activer le mouvement
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault(); // Empêcher le comportement par défaut
      const direction = btn.dataset.direction; // Récupérer la direction depuis l'attribut data-direction
      
      // Activer la touche correspondante selon la direction
      if (direction === "up") keys.z.pressed = true;
      if (direction === "down") keys.s.pressed = true;
      if (direction === "left") keys.q.pressed = true;
      if (direction === "right") keys.d.pressed = true;
    });

    // Relâchement souris : désactiver le mouvement
    btn.addEventListener("mouseup", (e) => {
      e.preventDefault();
      const direction = btn.dataset.direction;
      
      // Désactiver la touche correspondante
      if (direction === "up") keys.z.pressed = false;
      if (direction === "down") keys.s.pressed = false;
      if (direction === "left") keys.q.pressed = false;
      if (direction === "right") keys.d.pressed = false;
    });

    // ===== ÉVÉNEMENTS TACTILES (MOBILE) =====
    
    // Appui tactile : activer le mouvement
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault(); // Empêcher le scroll/zoom sur mobile
      const direction = btn.dataset.direction;
      
      // Activer la touche correspondante selon la direction
      if (direction === "up") keys.z.pressed = true;
      if (direction === "down") keys.s.pressed = true;
      if (direction === "left") keys.q.pressed = true;
      if (direction === "right") keys.d.pressed = true;
    });

    // Relâchement tactile : désactiver le mouvement
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      const direction = btn.dataset.direction;
      
      // Désactiver la touche correspondante
      if (direction === "up") keys.z.pressed = false;
      if (direction === "down") keys.s.pressed = false;
      if (direction === "left") keys.q.pressed = false;
      if (direction === "right") keys.d.pressed = false;
    });
  });
}