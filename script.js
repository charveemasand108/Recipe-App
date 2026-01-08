// -------------------- SELECT ELEMENTS --------------------
const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');

// Modal elements
const modal = document.querySelector('.recipe-modal');
const closeBtn = document.querySelector('.close-btn');
const recipeTitle = document.getElementById('recipe-title');
const recipeImg = document.getElementById('recipe-img');
const recipeInstructions = document.getElementById('recipe-instructions');

// -------------------- FETCH RECIPES --------------------
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = `<p class="loading">Fetching recipes...</p>`;

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    // 🚨 Network-level error
    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    // ❌ No recipes found (wrong input)
    if (!data.meals) {
      recipeContainer.innerHTML = `
        <p class="error">
          ❌ No recipes found for "<strong>${query}</strong>"
        </p>
      `;
      return;
    }

    // ✅ Clear container before rendering
    recipeContainer.innerHTML = "";

    data.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="recipe-info">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strArea}</p>
          <p>Belongs to ${meal.strCategory} Category</p>
          <button class="view-btn">View Recipe</button>
        </div>
      `;

      const viewBtn = recipeDiv.querySelector('.view-btn');
      viewBtn.addEventListener('click', () => openRecipeModal(meal));

      recipeContainer.appendChild(recipeDiv);
    });

  } catch (error) {
    // ❌ Fetch / API error
    recipeContainer.innerHTML = `
      <p class="error">
        ⚠️ Error fetching recipes. Please check your connection.
      </p>
    `;
    console.error(error);
  }
};

// -------------------- MODAL FUNCTIONS --------------------
const openRecipeModal = (meal) => {
  recipeTitle.textContent = meal.strMeal;
  recipeImg.src = meal.strMealThumb;
  recipeInstructions.textContent = meal.strInstructions;
  modal.classList.remove('hidden');
};

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// -------------------- SEARCH HANDLERS --------------------
const handleSearch = (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();


  if (searchInput === "") {
    recipeContainer.innerHTML = `
      <p class="error">⚠️ Please enter a recipe name</p>
    `;
    return;
  }

  fetchRecipes(searchInput);
};

searchBtn.addEventListener('click', handleSearch);

searchBox.addEventListener('keydown', (e) => {
  if (e.key === "Enter") handleSearch(e);
});
