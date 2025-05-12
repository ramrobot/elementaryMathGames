document.addEventListener("DOMContentLoaded", () => {
  const targetWeight = Math.floor(Math.random() * 101) + 50; // Random weight between 50g and 150g
  const targetWeightEl = document.getElementById("target-weight");
  const currentWeightEl = document.getElementById("current-weight");
  const resultMessageEl = document.getElementById("result-message");
  const ingredientButtons = document.querySelectorAll(".ingredient-btn");
  const checkButton = document.getElementById("check-button");
  const pizzaIngredientsContainer =
    document.getElementById("pizza-ingredients");

  let currentWeight = 0;

  // Display the target weight
  targetWeightEl.textContent = `Target Weight: ${targetWeight}g`;

  // Add event listeners to ingredient buttons
  ingredientButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const weight = parseInt(button.getAttribute("data-weight"), 10);
      const ingredient = button.getAttribute("data-ingredient");
      currentWeight += weight;
      currentWeightEl.textContent = `Current Weight: ${currentWeight}g`;

      // Create an ingredient element
      const ingredientEl = document.createElement("img");
      ingredientEl.src = `images/${ingredient}.png`; // Assuming you have images named after each ingredient
      ingredientEl.classList.add("ingredient");

      // Randomize the position on the pizza
      ingredientEl.style.top = `${Math.random() * 80}%`;
      ingredientEl.style.left = `${Math.random() * 80}%`;

      // Add the ingredient to the pizza
      pizzaIngredientsContainer.appendChild(ingredientEl);
    });
  });

  // Check the pizza weight
  checkButton.addEventListener("click", () => {
    if (currentWeight === targetWeight) {
      resultMessageEl.textContent =
        "Perfect! You've made the pizza with the right weight!";
      resultMessageEl.style.color = "green";
    } else if (currentWeight < targetWeight) {
      resultMessageEl.textContent = "Too light! Add more ingredients.";
      resultMessageEl.style.color = "orange";
    } else {
      resultMessageEl.textContent = "Too heavy! Remove some ingredients.";
      resultMessageEl.style.color = "red";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const targetWeight = Math.floor(Math.random() * 101) + 50; // Random weight between 50g and 150g
  const targetWeightEl = document.getElementById("target-weight");
  const currentWeightEl = document.getElementById("current-weight");
  const resultMessageEl = document.getElementById("result-message");
  const ingredientButtons = document.querySelectorAll(".ingredient-btn");
  const checkButton = document.getElementById("check-button");
  const clearButton = document.getElementById("clear-button"); // New Button
  const pizzaIngredientsContainer =
    document.getElementById("pizza-ingredients");

  let currentWeight = 0;

  // Display the target weight
  targetWeightEl.textContent = `Target Weight: ${targetWeight}g`;

  // Add event listeners to ingredient buttons
  ingredientButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const weight = parseInt(button.getAttribute("data-weight"), 10);
      const ingredient = button.getAttribute("data-ingredient");
      currentWeight += weight;
      currentWeightEl.textContent = `Current Weight: ${currentWeight}g`;

      // Create an ingredient element
      const ingredientEl = document.createElement("img");
      ingredientEl.src = `images/${ingredient}.png`; // Assuming you have images named after each ingredient
      console.log(ingredientEl.src);
      ingredientEl.classList.add("ingredient");

      // Randomize the position on the pizza
      ingredientEl.style.top = `${Math.random() * 80}%`;
      ingredientEl.style.left = `${Math.random() * 80}%`;

      // Add the ingredient to the pizza
      pizzaIngredientsContainer.appendChild(ingredientEl);
    });
  });

  // Check the pizza weight
  checkButton.addEventListener("click", () => {
    if (currentWeight === targetWeight) {
      resultMessageEl.textContent =
        "Perfect! You've made the pizza with the right weight!";
      resultMessageEl.style.color = "green";
    } else if (currentWeight < targetWeight) {
      resultMessageEl.textContent = "Too light! Add more ingredients.";
      resultMessageEl.style.color = "orange";
    } else {
      resultMessageEl.textContent = "Too heavy! Remove some ingredients.";
      resultMessageEl.style.color = "red";
    }
  });

  // Clear ingredients from the pizza
  clearButton.addEventListener("click", () => {
    currentWeight = 0;
    currentWeightEl.textContent = `Current Weight: ${currentWeight}g`;
    pizzaIngredientsContainer.innerHTML = ""; // Remove all ingredient images
    resultMessageEl.textContent = ""; // Clear result message
  });
});
