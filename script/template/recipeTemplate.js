function recipeTemplate(recipe) {
  const {
    id,
    image,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
  } = recipe;

  const picture = `./assets/images/recettes/${image}`;

  // Crée le DOM de la carte recette
  function getRecipeCardDOM() {
    return `
    <article id="recipe-${id}">
        <div class="image-container">
            <img src="${picture}" alt="${name}">
            <span>${time} min</span>
        </div>
        <div class="text-content">
            <h2>${name}</h2>
            <h3>Recette</h3>
            <p class="description">${description}</p>
            <h3>Ingrédients</h3>
            <div class="ingredients-list">
                ${ingredients
                  .map(
                    (ingredient) => `
                    <div>
                        <h4>${ingredient.ingredient}</h4>
                        <p class="ingredient">${
                          ingredient.quantity ? ingredient.quantity : ""
                        } ${ingredient.unit ? ingredient.unit : ""}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
      </div>
    </article>
  `;
  }
  return {
    id,
    image,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
    getRecipeCardDOM,
  };
}

// Crée le DOM du tag sélectionné
function createTagElement(name, category) {
  return `
  <div class="tag tag-${category}"">
    <span>${name}</span>
    <button class="btn tag-close" data-name="${name}" data-category="${category}" aria-label="Supprimer ce tag">
      <i class="bi bi-x fs-3"></i>
    </button>
  </div>
  `;
}
