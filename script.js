// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const gradeSelection = document.getElementById("grade-selection");
  const gameOptions = document.getElementById("game-options");
  const gradeButtons = document.querySelectorAll(".grade-btn");
  const selectedGradeDisplay = document.getElementById("selected-grade");
  const linkCorre = document.getElementById("link-corre");
  const linkEscapaLaberinto = document.getElementById("link-escapa-laberinto");
  const backButton = document.getElementById("back-button");
  
  let selectedGrade = "";
  
  // Set initial state - now we start with grade selection visible
  gradeSelection.classList.remove("hidden");
  gameOptions.classList.add("hidden");
  
  // Grade button click handler
  gradeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Get selected grade
      selectedGrade = e.target.closest('.grade-btn').getAttribute("data-grade");
      
      // Update display
      selectedGradeDisplay.innerHTML = `<p>Grado: <strong>${selectedGrade}</strong></p>`;
      
      // Update game buttons with grade parameter
      const gradeParam = encodeURIComponent(selectedGrade);
      linkCorre.setAttribute("onclick", `jugar('${gradeParam}','1')`);
      linkEscapaLaberinto.setAttribute("onclick", `jugar('${gradeParam}','3')`);
      
      // Show games, hide grade selection
      gradeSelection.classList.add("hidden");
      gameOptions.classList.remove("hidden");
      
      // Add success sound effect
      playSound('success');
    });
  });
  
  // Back button to change grade
  backButton.addEventListener("click", () => {
    gradeSelection.classList.remove("hidden");
    gameOptions.classList.add("hidden");
    playSound('click');
  });
  
  // Sound effects function
  function playSound(type) {
    // This is just a placeholder - you would need to implement actual sounds
    console.log(`Playing ${type} sound`);
    // Example implementation would be:
    // const sound = new Audio(`sounds/${type}.mp3`);
    // sound.play();
  }
});

// Game launcher function
function jugar(grado, juego) {
  if (grado === '') {
    alert("¡Primero debes seleccionar un grado!");
  } else {
    // Add loading animation or transition here
    document.body.classList.add('loading');
    
    setTimeout(() => {
      switch(juego) {
        case "1":
          window.location.href = `./corre/index.html?grado=${grado}`;
          break;
        case "3":
          window.location.href = `./laberinto/index.html?grado=${grado}`;
          break;
        default:
          console.log("Juego no encontrado");
      }
    }, 300); // Short delay for transition effect
  }
}