// ============================================
// SYSTÈME DE DÉTECTION DE COLLISIONS
// ============================================

/**
 * Vérifie si deux rectangles entrent en collision
 * Utilise la méthode AABB (Axis-Aligned Bounding Box)
 * 
 * @param {Object} rectangle1 - Premier rectangle avec position {x, y}, width et height
 * @param {Object} rectangle2 - Deuxième rectangle avec position {x, y}, width et height
 * @returns {boolean} - True si collision détectée, false sinon
 */
export function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    // Vérifie si le bord droit de rectangle1 dépasse le bord gauche de rectangle2
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    // Vérifie si le bord gauche de rectangle1 est avant le bord droit de rectangle2
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    // Vérifie si le bord bas de rectangle1 dépasse le bord haut de rectangle2
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    // Vérifie si le bord haut de rectangle1 est avant le bord bas de rectangle2
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

/**
 * Vérifie si le joueur entrera en collision avec un objet lors de son prochain mouvement
 * Utilisé pour empêcher le joueur de traverser des NPCs, objets, etc.
 * 
 * @param {Object} player - Objet joueur avec position, width, height
 * @param {Array} objects - Tableau d'objets (NPCs, items, obstacles, etc.)
 * @param {string} direction - Direction du mouvement ('up', 'down', 'left', 'right')
 * @param {number} speed - Vitesse du déplacement en pixels
 * @returns {boolean} - True si collision prévue, false sinon
 */
export function checkObjectCollision(player, objects, direction, speed) {
  // ===== CALCUL DE LA POSITION FUTURE DU JOUEUR =====
  // Crée une copie du joueur pour simuler sa future position
  const futurePlayer = {
    ...player,
    position: { ...player.position }
  };

  // Ajuste la position future selon la direction du mouvement
  switch(direction) {
    case 'up':
      futurePlayer.position.y -= speed;
      break;
    case 'down':
      futurePlayer.position.y += speed;
      break;
    case 'left':
      futurePlayer.position.x -= speed;
      break;
    case 'right':
      futurePlayer.position.x += speed;
      break;
  }

  // ===== VÉRIFICATION DES COLLISIONS =====
  // Parcourt tous les objets pour vérifier les collisions potentielles
  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    
    // Ignore les objets déjà collectés (items ramassés, etc.)
    if (obj.collected === true) {
      continue;
    }
    
    // Calcule les dimensions réelles de l'objet
    // (prend en compte le facteur de scale si présent, sinon utilise 1)
    const objWidth = obj.width * (obj.scale || 1);
    const objHeight = obj.height * (obj.scale || 1);
    
    // Teste la collision entre la future position du joueur et l'objet actuel
    if (rectangularCollision({
      rectangle1: futurePlayer,
      rectangle2: {
        position: obj.position,
        width: objWidth,
        height: objHeight
      }
    })) {
      return true; // Collision détectée, bloque le mouvement
    }
  }

  return false; // Aucune collision, le mouvement est autorisé
}