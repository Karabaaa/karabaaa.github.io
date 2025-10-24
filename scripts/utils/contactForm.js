// FORMULAIRE DE CONTACT - FISHEYE : Gestion de la modale de contact avec navigation clavier
let modalOpen = false;

// Ouvre la modale de contact et configure les événements clavier
function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");

  // Petit délai pour s'assurer que l'affichage est terminé avant de donner le focus
  setTimeout(() => {
    const firstInput = document.getElementById("first");
    if (firstInput) {
      firstInput.focus();
    }
  }, 10);

  document.addEventListener("keydown", onModalKeyDown);
  const form = document.getElementById("contact-form");
  if (form) form.addEventListener("keydown", onValidateFormEnterKey);
  modalOpen = true;
}

// Ferme la modale et remet le focus sur le bouton d'ouverture
function closeModal() {
  const modal = document.getElementById("contact_modal");
  const opener = document.getElementById("open-contact") || document.body;
  const form = document.getElementById("contact-form");
  if (form) form.removeEventListener("keydown", onValidateFormEnterKey);
  opener.focus();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", onModalKeyDown);
  modalOpen = false;
}

// Gère la fermeture de la modale avec la touche Échap
function onModalKeyDown(e) {
  if (!modalOpen) return;
  if (e.key === "Escape") {
    e.preventDefault();
    closeModal();
  }
}

// Permet la validation du formulaire avec la touche Entrée
function onValidateFormEnterKey(e) {
  if (e.key !== "Enter" || e.shiftKey) return;
  e.preventDefault();
  const form = document.getElementById("contact-form");
  if (form) form.requestSubmit();
}

// Traite la soumission du formulaire : validation et affichage en console
function submitForm(event) {
  event.preventDefault();

  const first = document.getElementById("first");
  const last = document.getElementById("last");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const form = document.getElementById("contact-form");

  const firstV = first.value.trim();
  const lastV = last.value.trim();
  const emailV = email.value.trim();
  const messageV = message.value.trim();

  if (firstV && lastV && emailV && messageV) {
    console.log("Prénom:", firstV);
    console.log("Nom:", lastV);
    console.log("Email:", emailV);
    console.log("Message:", messageV);
    form.reset();
    closeModal();
    return;
  } else {
    alert("Vous devez remplir tous les champs pour valider le formulaire.");
  }
}
