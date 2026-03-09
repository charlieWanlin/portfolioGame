// ==========================================
// GESTION DE L'INTERFACE UTILISATEUR (UI)
// ==========================================

// ==========================================
// ÉLÉMENTS DOM
// ==========================================
const burgerMenu = document.getElementById("hamburger");
const healthContainer = document.querySelector(".health-container");
const hamburger = document.getElementById("hamburger");
const menuInGame = document.getElementById("menu");
const closeMenu = document.getElementById("closeMenu");
const demarrageButton = document.getElementById("demarrageButton");

// ==========================================
// AFFICHER/MASQUER LE MENU BURGER
// ==========================================
export function toggleBurgerMenu(show) {
  if (burgerMenu) {
    burgerMenu.style.display = show ? "block" : "none";
  }
}

// ==========================================
// AFFICHER/MASQUER LES CŒURS
// ==========================================
export function toggleHealthDisplay(show) {
  if (healthContainer) {
    healthContainer.style.display = show ? "flex" : "none";
  }
}

// ==========================================
// INITIALISATION DES ÉLÉMENTS UI AU DÉMARRAGE
// ==========================================
export function initUI() {
  // Au démarrage, masquer le menu burger ET les cœurs
  toggleBurgerMenu(false);
  toggleHealthDisplay(false);

  // Événement toggle du menu in-game
  hamburger.addEventListener("click", () => menuInGame.classList.toggle("show"));
  
  // Événement fermeture du menu in-game
  closeMenu.addEventListener("click", () => menuInGame.classList.remove("show"));
}

// ==========================================
// RÉINITIALISER L'INTERFACE AU RETOUR AU MENU
// ==========================================
export function resetUI() {
  toggleBurgerMenu(false);
  toggleHealthDisplay(false);
  menuInGame.classList.remove("show");
}

// ==========================================
// EXPORTER LE BOUTON DÉMARRAGE POUR Y ATTACHER DES ÉVÉNEMENTS
// ==========================================
export { demarrageButton };