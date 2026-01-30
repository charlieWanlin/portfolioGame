const retourAccueil = document.querySelector(".retourAccueil");

retourAccueil.addEventListener("click", () => {
  window.location.href = "index.html";
});

const demarrageButton = document.querySelector("#demarrageButton");

demarrageButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Détection du chemin de base en fonction de l'environnement d'hébergement
const basePath = window.location.hostname.includes("github.io")
  ? "/portfolioGame"
  : "";

// La lettre de motivation qui s'ouvre dans une autre page
const openMotivationBtn = document.getElementById("openMotivationfBtn");
openMotivationBtn.addEventListener("click", () => {
  window.open(`${basePath}/files/lettreMotivationCW.pdf`, "_blank");
  document.getElementById("messageOverlayParchemin").style.display = "none";
});

const openCVButton = document.querySelector(".openCVButton");
openCVButton.addEventListener("click", () => {
  window.open(`${basePath}/files/monCV.pdf`, "_blank");
});
