// LIGHTBOX - FISHEYE : Gestion de l'affichage des médias en plein écran avec navigation
let lightboxOpen = false;

// Ouvre la lightbox et active la navigation clavier
function displayLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", onLightboxKeyDown);
  lightboxOpen = true;
}

// Ferme la lightbox et désactive les événements clavier
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", onLightboxKeyDown);
  lightboxOpen = false;
}

// Gère la navigation clavier dans la lightbox
function onLightboxKeyDown(e) {
  if (!lightboxOpen) return;
  switch (e.key) {
    case "Escape":
      e.preventDefault();
      closeLightbox();
      break;
    case "ArrowLeft":
      e.preventDefault();
      previous();
      break;
    case "ArrowRight":
      e.preventDefault();
      next();
      break;
  }
}

let gallery = [];
let currentIndex = 0;

// Construit le tableau de médias pour la lightbox
function buildGallery(medias, folder) {
  gallery = medias.map((m) => {
    const isImage = !!m.image;
    return {
      type: isImage ? "image" : "video",
      src: isImage
        ? `./assets/photos/${folder}/${m.image}`
        : `./assets/photos/${folder}/${m.video}`,
      title: m.title || "",
      alt: m.title,
    };
  });
}

// Ouvre la lightbox sur un média spécifique
function openLightboxAt(index) {
  if (!gallery.length) return;
  currentIndex = ((index % gallery.length) + gallery.length) % gallery.length;
  displayLightbox();
  renderLightbox();
}

// Navigue vers le média précédent avec pause automatique des vidéos
function previous() {
  if (!gallery.length) return;
  pauseVideoIfAny();
  currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
  renderLightbox();
}

// Navigue vers le média suivant avec pause automatique des vidéos
function next() {
  if (!gallery.length) return;
  pauseVideoIfAny();
  currentIndex = (currentIndex + 1) % gallery.length;
  renderLightbox();
}

// Met en pause les vidéos en cours de lecture lors du changement de média
function pauseVideoIfAny() {
  const video = document.querySelector("#lightbox .picture video");
  if (video && !video.paused) {
    video.pause();
  }
}

// Affiche le média actuel dans la lightbox (image ou vidéo) avec titre
function renderLightbox() {
  const container = document.querySelector("#lightbox .picture");

  if (!container || !gallery.length) return;

  const item = gallery[currentIndex];

  container.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "media-wrap";

  const box = document.createElement("div");
  box.className = "media-box";

  if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.title || "Photo";
    box.appendChild(img);
  } else {
    const video = document.createElement("video");
    video.src = item.src;
    video.title = item.title || "Vidéo";
    video.controls = true;
    video.autoplay = true;
    box.appendChild(video);
  }
  wrap.appendChild(box);

  if (item.title) {
    const caption = document.createElement("p");
    caption.textContent = item.title;
    caption.className = "lb-caption";
    wrap.appendChild(caption);
  }

  container.appendChild(wrap);
}
