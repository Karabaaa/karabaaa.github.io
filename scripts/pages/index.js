// PAGE D'ACCUEIL - FISHEYE :  Récupère la liste des photographes depuis le fichier JSON
async function getPhotographers() {
  const res = await fetch("./data/photographers.json");
  const data = await res.json();
  const photographers = data.photographers;
  return { photographers };
}
// Affiche les cartes des photographes dans la section dédiée
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

// Initialise la page d'accueil : récupère et affiche les photographes
async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
