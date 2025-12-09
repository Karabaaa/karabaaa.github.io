const searchButton = document.getElementById("search-button");
const searchIcon = document.querySelector(".bi-search");
const searchInput = document.getElementById("search-input");
const recipesContainer = document.querySelector(".recipes-container");
const tagsContainer = document.querySelector(".tags-container");

// Configuration factorisée pour les dropdowns
const dropdownConfigs = [
  {
    inputSelector: "#search-input-ingredients",
    dropdownSelector: ".dropdown-items-ingredients",
    getAllItems: (recipes) =>
      recipes.flatMap((recipe) =>
        recipe.ingredients.map((i) => i.ingredient.toLowerCase())
      ),
    category: "ingredients",
  },
  {
    inputSelector: "#search-input-appliances",
    dropdownSelector: ".dropdown-items-appliances",
    getAllItems: (recipes) =>
      recipes.map((recipe) => recipe.appliance.toLowerCase()),
    category: "appliances",
  },
  {
    inputSelector: "#search-input-ustensils",
    dropdownSelector: ".dropdown-items-ustensils",
    getAllItems: (recipes) =>
      recipes.flatMap((recipe) => recipe.ustensils.map((u) => u.toLowerCase())),
    category: "ustensils",
  },
];

// Attache les listeners des dropdowns une seule fois
function setupDropdownListeners() {
  dropdownConfigs.forEach(
    ({ inputSelector, dropdownSelector, getAllItems, category }) => {
      const input = document.querySelector(inputSelector);
      input.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const currentRecipes = window.currentFilteredRecipes || recipes;
        const filtered = getUniqueSortedList(
          getAllItems(currentRecipes)
        ).filter((item) => item.includes(value));
        populateDropdownItems(dropdownSelector, filtered, category);
      });
    }
  );
}

// Met à jour les données des dropdowns sans toucher aux listeners
function updateDropdownData(currentRecipes) {
  dropdownConfigs.forEach(({ dropdownSelector, getAllItems, category }) => {
    populateDropdownItems(
      dropdownSelector,
      getUniqueSortedList(getAllItems(currentRecipes)),
      category
    );
  });
}

function populateDropdownItems(selector, items, category) {
  const container = document.querySelector(selector);
  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("dropdown-item");
    li.innerHTML = item;

    // Si le tag est sélectionné, on colore et ajoute la croix
    if (selectedTags[category].includes(item)) {
      li.classList.add("selected-dropdown-item");
      li.innerHTML = `
        <span>${item}</span>
        <i class="bi bi-x-circle-fill black fs-5 dropdown-tag-remove"></i>
      `;
      // Gestion du clic sur la croix pour désélectionner
      li.querySelector(".dropdown-tag-remove").addEventListener(
        "click",
        (e) => {
          e.stopPropagation(); // Empêche le clic sur le li d’ajouter le tag
          selectedTags[category] = selectedTags[category].filter(
            (t) => t !== item
          );
          renderTags();
          runSearch(searchInput.value);
        }
      );
    } else {
      // Ajout du tag au clic
      li.addEventListener("click", () => {
        addTag(item, category);
      });
    }

    container.appendChild(li);
  });
}

function getUniqueSortedList(array) {
  return Array.from(new Set(array)).sort(); // Set = collection qui ne contient que des valeurs uniques, si j'utilise [] je peux avoir des doublons.
}

// Fonction d'initialisation
async function init() {
  const recipesHTML = recipes
    .map((recipe) => {
      const recipeModel = recipeTemplate(recipe);
      return recipeModel.getRecipeCardDOM();
    })
    .join("");
  recipesContainer.innerHTML = recipesHTML;

  // Attache les listeners UNE SEULE FOIS
  setupDropdownListeners();
  updateDropdownData(recipes);
  updateRecipeCount(recipes.length);
  clearDropdownInputs("ingredients");
  clearDropdownInputs("appliances");
  clearDropdownInputs("ustensils");
  window.currentFilteredRecipes = recipes;
}

// Fonction centrale de recherche
function runSearch(query) {
  const filteredRecipes = getFilteredRecipes(recipes, query, selectedTags);
  recipesContainer.innerHTML = "";
  const noResultsContainer = document.querySelector(".no-results-container");
  noResultsContainer.innerHTML = "";
  if (filteredRecipes.length === 0) {
    const message = `Aucune recette ne contient '${query}' vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
    const noResultElement = document.createElement("p");
    noResultElement.classList.add("no-results-message");
    noResultElement.textContent = message;
    noResultsContainer.appendChild(noResultElement);
  } else {
    const recipesHTML = filteredRecipes
      .map((recipe) => {
        const recipeModel = recipeTemplate(recipe);
        return recipeModel.getRecipeCardDOM();
      })
      .join("");
    recipesContainer.innerHTML = recipesHTML;
  }
  updateRecipeCount(filteredRecipes.length);
  updateDropdownData(filteredRecipes);
  window.currentFilteredRecipes = filteredRecipes;
}

// Met à jour dynamiquement le nombre de recettes
function updateRecipeCount(count) {
  const subtitle = document.querySelector(".subtitle");
  const displayCount = count < 10 ? `0${count}` : count;
  subtitle.textContent = `${displayCount} recette${count === 1 ? "" : "s"}`;
}

// recherche explicite
searchButton.addEventListener("click", function () {
  runSearch(searchInput.value);
});

// Bouton clear : vide l'input et réaffiche toutes les recettes
const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", function () {
  searchInput.value = "";
  runSearch("");
});

//clear dropdown inputs on click
function clearDropdownInputs(category) {
  const input = document.getElementById("search-input-" + category);
  const button = document.getElementById("clear-button-" + category);
  const config = dropdownConfigs.find((config) => config.category === category);
  button.onclick = function (e) {
    e.stopPropagation();
    e.preventDefault();
    input.value = "";
    const currentRecipes = window.currentFilteredRecipes || recipes;
    populateDropdownItems(
      config.dropdownSelector,
      getUniqueSortedList(config.getAllItems(currentRecipes)),
      category
    );
    // equivaut à input.dispatchEvent(new Event("input"));
  };
}

// Ajout d’un tag au clic sur un filtre
function addTag(name, category) {
  if (!selectedTags[category].includes(name)) {
    selectedTags[category].push(name);
    renderTags();
    runSearch(searchInput.value);
  }
}

// Affichage et suppression des tags
function renderTags() {
  tagsContainer.innerHTML = "";
  // Object.entries transforme un objet en tableau de paires [clé, valeur]
  Object.entries(selectedTags).forEach(([category, tags]) => {
    tags.forEach((tag) => {
      const tagElement = createTagElement(tag, category);
      tagsContainer.innerHTML += tagElement;
    });
  });
  addTagCloseListeners();
}

// Suppression d’un tag
function addTagCloseListeners() {
  document.querySelectorAll(".tag-close").forEach((btn) => {
    btn.addEventListener("click", function () {
      const name = this.dataset.name;
      const category = this.dataset.category;
      selectedTags[category] = selectedTags[category].filter((t) => t !== name);
      renderTags();
      runSearch(searchInput.value);
    });
  });
}

// Debounce pour limiter les appels à runSearch
let searchTimeout;
function debounceSearch(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    runSearch(query);
  }, 300);
}

// Recherche en direct sur l'input principal avec debounce
searchInput.addEventListener("input", (event) => {
  debounceSearch(event.target.value);
});

// Lancement de l'app
init();
