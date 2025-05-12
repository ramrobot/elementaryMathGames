
/**
 *
 * BOXY RUN
 * ----
 * Simple Temple-Run-esque game, created with love by Wan Fung Chui.
 *
 */

/**
 * Constants used in this game.
 */
var Colors = {
	cherry: 0xe35d6a,
	blue: 0x1560bd,
	red: 0xff0000,
	white: 0xd8d0d1,
	black: 0x000000,
	//brown: 0x59332e,
	brown: 0x8D5524,
	peach: 0xffdab9,
	yellow: 0xffff00,
	olive: 0x556b2f,
	grey: 0x696969,
	sand: 0xc2b280,
	brownDark: 0x23190f,
	green: 0x669900,
};

var deg2Rad = Math.PI / 180;

// Make a new world when the page is loaded.
window.addEventListener('load', function(){
	new World();
});

const preguntasAritmetica = {
	"4to primaria": [
		["¿Cuánto es 7 + 5?", "10", "12", "14", 2],
		["¿Cuánto es 15 - 8?", "5", "7", "6", 2],
		["¿Cuánto es 9 + 6?", "14", "15", "13", 2],
		["¿Cuánto es 20 - 11?", "8", "9", "10", 2],
		["¿Cuánto es 13 + 7?", "18", "20", "19", 2],
		["¿Cuánto es 18 - 9?", "8", "10", "9", 3],
		["¿Cuánto es 25 + 5?", "30", "32", "28", 1],
		["¿Cuánto es 30 - 12?", "20", "18", "19", 2],
		["¿Cuánto es 6 + 14?", "21", "22", "20", 3],
		["¿Cuánto es 50 - 25?", "26", "24", "25", 3]
	],
	"5to primaria": [
		["¿Cuánto es 45 + 27?", "72", "74", "73", 1],
		["¿Cuánto es 90 - 44?", "46", "45", "47", 1],
		["¿Cuánto es 120 + 38?", "157", "158", "160", 2],
		["¿Cuánto es 250 - 75?", "180", "175", "170", 2],
		["¿Cuánto es 33 + 19?", "52", "51", "53", 1],
		["¿Cuánto es 85 - 47?", "39", "40", "38", 3],
		["¿Cuánto es 123 + 77?", "199", "200", "198", 2],
		["¿Cuánto es 345 - 120?", "225", "223", "224", 1],
		["¿Cuánto es 78 + 34?", "111", "110", "112", 3],
		["¿Cuánto es 500 - 276?", "225", "224", "223", 2]
	],
	"6to primaria": [
		["¿Cuánto es 245 + 134?", "378", "379", "377", 2],
		["¿Cuánto es 640 - 315?", "326", "325", "324", 2],
		["¿Cuánto es 512 + 288?", "801", "800", "799", 2],
		["¿Cuánto es 900 - 487?", "414", "413", "412", 2],
		["¿Cuánto es 1234 + 567?", "1800", "1801", "1802", 2],
		["¿Cuánto es 2048 - 1024?", "1024", "1025", "1023", 1],
		["¿Cuánto es 750 + 450?", "1201", "1199", "1200", 3],
		["¿Cuánto es 1800 - 795?", "1004", "1005", "1006", 2],
		["¿Cuánto es 999 + 1?", "999", "1001", "1000", 3],
		["¿Cuánto es 2050 - 1050?", "999", "1001", "1000", 3]
	]
};

/** 
 *
 * THE WORLD
 * 
 * The world in which Boxy Run takes place.
 *
 */

/** 
  * A class of which the world is an instance. Initializes the game
  * and contains the main game loop.
  *
  */

function getGradoFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return params.get("grado");
  }


const grado = getGradoFromUrl();
const preguntas = preguntasAritmetica[grado];

function triggerKeyEvent(key) {
	//document.dispatchEvent(new Event('keypress', {keyCode: 'a'}))
	document.dispatchEvent(new KeyboardEvent('keydown', { key: key, code: `${key}`, bubbles: true }));
	//document.dispatchEvent(new KeyboardEvent('keyup', { key: key, code: `Arrow${key}`, bubbles: true }));
}



function World() {

	// Explicit binding of this even in changing contexts.
	var self = this;

	// Scoped variables in this world.
	var element, scene, camera, character, renderer, light,
		objects, paused, keysAllowed, score, difficulty,
		treePresenceProb, maxTreeSize, fogDistance, gameOver;
	
	var questions_data = [];

	// Initialize the world.
	init();
	
	/**
	  * Builds the renderer, scene, lights, camera, and the character,
	  * then begins the rendering loop.
	  */
	function init() {

		// Locate where the world is to be located on the screen.
		element = document.getElementById('world');

		// Initialize the renderer.
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		renderer.setSize(element.clientWidth, element.clientHeight);
		renderer.shadowMap.enabled = true;
		element.appendChild(renderer.domElement);

		// Initialize the scene.
		scene = new THREE.Scene();
		fogDistance = 40000;
		scene.fog = new THREE.Fog(0xbadbe4, 1, fogDistance);

		// Initialize the camera with field of view, aspect ratio,
		// near plane, and far plane.
		camera = new THREE.PerspectiveCamera(
			60, element.clientWidth / element.clientHeight, 1, 120000);
		camera.position.set(0, 1500, -2000);
		camera.lookAt(new THREE.Vector3(0, 600, -5000));
		window.camera = camera;

		// Set up resizing capabilities.
		window.addEventListener('resize', handleWindowResize, false);

		// Initialize the lights.
		light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
		scene.add(light);

		// Initialize the character and add it to the scene.
		character = new Character();
		scene.add(character.element);

		var ground = createBox(3000, 20, 120000, Colors.sand, 0, -400, -60000);
		scene.add(ground);

		objects = [];
		treePresenceProb = 1;//0.2;
		maxTreeSize = 0.5;
		var pregunta = null;

		/*for (var i = 10; i < 11; i++) {
			pregunta = preguntas[Math.floor(Math.random() * preguntas.length)];
			createRowOfTrees(i * -3000, treePresenceProb, 0.5, maxTreeSize, pregunta);
			setValuesHTML();
		}*/

		// The game is paused to begin with and the game is not over.
		gameOver = false;
		paused = true;

		// Start receiving feedback from the player.
		var left = 37;
		var up = 38;
		var right = 39;
		var p = 80;
		
		keysAllowed = {};
		document.addEventListener(
			'keydown',
			function(e) {
				if (!gameOver) {
					var key = e.keyCode;
					if (keysAllowed[key] === false) return;
					keysAllowed[key] = false;
					if (paused && !collisionsDetected() && key > 18) {
						paused = false;
						character.onUnpause();
						document.getElementById(
							"variable-content").style.visibility = "hidden";
						document.getElementById(
							"controls").style.display = "none";
					} else {
						if (key == p) {
							paused = true;
							character.onPause();
							document.getElementById(
								"variable-content").style.visibility = "visible";
							document.getElementById(
								"variable-content").innerHTML = 
								"El juego esta en pausa. Presiona cualquier tecla para continuar.";
						}
						if (key == up && !paused) {
							character.onUpKeyPressed();
						}
						if (key == left && !paused) {
							character.onLeftKeyPressed();
						}
						if (key == right && !paused) {
							character.onRightKeyPressed();
						}
					}
				}
			}
		);
		document.addEventListener(
			'keyup',
			function(e) {
				keysAllowed[e.keyCode] = true;
			}
		);
		document.addEventListener(
			'focus',
			function(e) {
				keysAllowed = {};
			}
		);

		// Initialize the scores and difficulty.
		score = 0;
		difficulty = 0;
		document.getElementById("score").innerHTML = score;

		// Begin the rendering loop.
		loop();

	}

	document.addEventListener('keydown', (event) => {
		if(event.key == 'ArrowLeft'){
			character.onLeftKeyPressed();
		}else if(event.key == 'ArrowRight'){
			character.onRightKeyPressed();
		}else if(event.key == "ArrowDown"){
			document.location.reload(true);
		}else if(event.key == "ArrowUp"){
			paused = false;
			character.onUnpause();
			document.getElementById(
				"variable-content").style.visibility = "hidden";
			document.getElementById(
				"controls").style.display = "none";
		}
		console.log(`Key Pressed: ${event.key}`);
	});
	
	/**
	  * The main animation loop.
	  */
	var counter = 600;
	var counter_dificulty = 0;
	var counter_limit = 600;

	function loop() {

		// Update the game.
		if (!paused) {

			setValuesHTML();
				if(counter == counter_limit){
				const pregunta_nueva = preguntas[Math.floor(Math.random() * preguntas.length)];
				createRowOfTrees(-120000, treePresenceProb, 0.5, maxTreeSize, pregunta_nueva);
				scene.fog.far = fogDistance;
				counter_dificulty += 1;
				counter = 0;
			}
			counter += 1;
			if (counter_dificulty == 5) {
				counter_dificulty = 0;
				if(counter_limit != 200){
					counter_limit -= 100;
				}
			}

			// Add more trees and increase the difficulty.
			/*if ((objects[objects.length - 1].mesh.position.z) % 3000 == 0) {
				difficulty += 1;
				var levelLength = 30;
				if (difficulty % levelLength == 0) {
					var level = difficulty / levelLength;
					switch (level) {
						case 1:
							treePresenceProb = 0.35;
							maxTreeSize = 0.5;
							break;
						case 2:
							treePresenceProb = 0.35;
							maxTreeSize = 0.85;
							break;
						case 3:
							treePresenceProb = 0.5;
							maxTreeSize = 0.85;
							break;
						case 4:
							treePresenceProb = 0.5;
							maxTreeSize = 1.1;
							break;
						case 5:
							treePresenceProb = 0.5;
							maxTreeSize = 1.1;
							break;
						case 6:
							treePresenceProb = 0.55;
							maxTreeSize = 1.1;
							break;
						default:
							treePresenceProb = 0.55;
							maxTreeSize = 1.25;
					}
				}
				if ((difficulty >= 5 * levelLength && difficulty < 6 * levelLength)) {
					fogDistance -= (25000 / levelLength);
				} else if (difficulty >= 8 * levelLength && difficulty < 9 * levelLength) {
					fogDistance -= (5000 / levelLength);
				}
				createRowOfTrees(-120000, treePresenceProb, 0.5, maxTreeSize);
				scene.fog.far = fogDistance;
			}*/

			// Move the trees closer to the character.
			objects.forEach(function(object) {
				object.mesh.position.z += 100;
			});

			// Remove trees that are outside of the world.
			objects = objects.filter(function(object) {
				return object.mesh.position.z < 0;
			});

			// Make the character move according to the controls.
			character.update();

			// Check for collisions between the character and objects.
			if (collisionsDetected()) {
				gameOver = true;
				paused = true;
				document.addEventListener(
        			'keydown',
        			function(e) {
        				if (e.keyCode == 40)
            			document.location.reload(true);
        			}
    			);
    			var variableContent = document.getElementById("variable-content");
    			variableContent.style.visibility = "visible";
    			variableContent.innerHTML = 
    				"Perdiste! :( Presiona reiniciar para continuar.";
    			var table = document.getElementById("ranks");
    			var rankNames = ["Te falta estudiar!!", "Te defiendes :)", "Eres bueno pero te falta estudiar", "Continua así y serar el mejor",
    				"Con el debido tiempo puedes con cualquier calculo :)", "Te falta poco para ser excelente en calculo!!", "Eres de los mejores en calculo!!", "Eres un genio!!!"];
    			var rankIndex = Math.floor(score / 15000);

				// If applicable, display the next achievable rank.
				if (score < 124000) {
					var nextRankRow = table.insertRow(0);
					nextRankRow.insertCell(0).innerHTML = (rankIndex <= 5)
						? "".concat((rankIndex + 1) * 15, "k-", (rankIndex + 2) * 15, "k")
						: (rankIndex == 6)
							? "105k-124k"
							: "124k+";
					nextRankRow.insertCell(1).innerHTML = "*La siguiente categoría esta en este rango.*";
				}

				// Display the achieved rank.
				var achievedRankRow = table.insertRow(0);
				achievedRankRow.insertCell(0).innerHTML = (rankIndex <= 6)
					? "".concat(rankIndex * 15, "k-", (rankIndex + 1) * 15, "k").bold()
					: (score < 124000)
						? "105k-124k".bold()
						: "124k+".bold();
				achievedRankRow.insertCell(1).innerHTML = (rankIndex <= 6)
					? "Felicidades! ".concat(rankNames[rankIndex], "!").bold()
					: (score < 124000)
						? "Felicidades! ".concat(rankNames[7], "!").bold()
						: "Felicidades! Pasaste la puntuación del creador logrando 123790 y venciste al juego!".bold();

    			// Display all ranks lower than the achieved rank.
    			if (score >= 120000) {
    				rankIndex = 7;
    			}
    			for (var i = 0; i < rankIndex; i++) {
    				var row = table.insertRow(i);
    				row.insertCell(0).innerHTML = "".concat(i * 15, "k-", (i + 1) * 15, "k");
    				row.insertCell(1).innerHTML = rankNames[i];
    			}
    			if (score > 124000) {
    				var row = table.insertRow(7);
    				row.insertCell(0).innerHTML = "105k-124k";
    				row.insertCell(1).innerHTML = rankNames[7];
    			}

			}

			// Update the scores.
			score += 10;
			document.getElementById("score").innerHTML = score;

		}

		// Render the page and repeat.
		renderer.render(scene, camera);
		requestAnimationFrame(loop);
	}

	/**
	  * A method called when window is resized.
	  */
	function handleWindowResize() {
		renderer.setSize(element.clientWidth, element.clientHeight);
		camera.aspect = element.clientWidth / element.clientHeight;
		camera.updateProjectionMatrix();
	}

	/**
	 * Creates and returns a row of trees according to the specifications.
	 *
	 * @param {number} POSITION The z-position of the row of trees.
 	 * @param {number} PROBABILITY The probability that a given lane in the row
 	 *                             has a tree.
 	 * @param {number} MINSCALE The minimum size of the trees. The trees have a 
 	 *							uniformly distributed size from minScale to maxScale.
 	 * @param {number} MAXSCALE The maximum size of the trees.
 	 *
	 */
	function createRowOfTrees(position, probability, minScale, maxScale, pregunta) {
		/*for (var lane = -1; lane < 2; lane++) {
			var randomNumber = Math.random();
			if (randomNumber < probability) {
				//var scale = minScale + (maxScale - minScale) * Math.random();
				var scale = 0.75
				var tree = new Wall(lane * 800, -400, position, scale, Colors.brownDark);
				objects.push(tree);
				scene.add(tree.mesh);
			}
		}*/

		var respuesta_correcta = pregunta[4]

		var scale = 0.75
		var tree = new Wall(-1 * 800, -400, position, scale, Colors.blue, false, pregunta);
		if(respuesta_correcta == 1){
			tree = new Wall(-1 * 800, -400, position, scale, Colors.blue, true, pregunta);
		}
		objects.push(tree);
		scene.add(tree.mesh);


		var scale = 0.75
		var tree = new Wall(0 * 800, -400, position, scale, Colors.red, false, pregunta);
		if(respuesta_correcta == 2){
			tree = new Wall(0 * 800, -400, position, scale, Colors.red, true, pregunta);
		}
		objects.push(tree);
		scene.add(tree.mesh);

		var scale = 0.75
		var tree = new Wall(1 * 800, -400, position, scale, Colors.green, false, pregunta);
		if(respuesta_correcta == 3){
			tree = new Wall(1 * 800, -400, position, scale, Colors.green, true, pregunta);
		}
		objects.push(tree);
		scene.add(tree.mesh);

		questions_data.push(pregunta);
		setValuesHTML();
		console.log("AGREGAN: "+questions_data);
		console.log(objects)
	}

	function setValuesHTML(){
		//var pregunta = objects[0].pregunta;
		if(questions_data != 0){
			var pregunta = objects[0].pregunta;
			document.getElementById("pregunta").innerHTML = `${pregunta[0]}`;
			document.getElementById("respuesta_1").innerText = `${pregunta[1]}`;
			document.getElementById("respuesta_2").innerText = `${pregunta[2]}`;
			document.getElementById("respuesta_3").innerText = `${pregunta[3]}`;
		}
	}

	/**
	 * Returns true if and only if the character is currently colliding with
	 * an object on the map.
	 */
 	function collisionsDetected() {
 		var charMinX = character.element.position.x - 115;
 		var charMaxX = character.element.position.x + 115;
 		var charMinY = character.element.position.y - 310;
 		var charMaxY = character.element.position.y + 320;
 		var charMinZ = character.element.position.z - 40;
 		var charMaxZ = character.element.position.z + 40;

		var colission_detected = 0;
 		for (var i = 0; i < objects.length; i++) {
 			if (objects[i].collides(charMinX, charMaxX, charMinY, 
 					charMaxY, charMinZ, charMaxZ)) {
						colission_detected = 1;
						if(questions_data.length > 0){
							questions_data = removeItemOnce(questions_data, objects[i].pregunta)
						}
						if(objects[i].respuesta_correcta != true){
							console.log("VALUE: "+objects[i].respuesta_correcta);
							console.log(objects[i].pregunta);
							return true;
						}
					setValuesHTML();
					
 			}
 		}
		if(colission_detected == 1){
			for (var i = 0; i < 3; i++) {
				objects[i].mesh.position.z += 10000;
			}
			objects.splice(0, 3);
		}
 		return false;
 	}
	
}

function removeItemOnce(arr, value) {
	var index = 0;
	for  (var i = 0; i < arr.length; i++) {
		if(arr[i][0] == value[0]){
			index = i;
			//console.log(arr[i][0]+" == "+ value[0]);
			break;
		}
	}
	if (index > -1) {
	  arr.splice(index, 1);
	}
	return arr;
  }


/** 
 *
 * IMPORTANT OBJECTS
 * 
 * The character and environmental objects in the game.
 *
 */

/**
 * The player's character in the game.
 */
function Character() {

	// Explicit binding of this even in changing contexts.
	var self = this;

	// Character defaults that don't change throughout the game.
	this.skinColor = Colors.brown;
	this.hairColor = Colors.black;
	this.shirtColor = Colors.red;
	this.shortsColor = Colors.blue;
	this.jumpDuration = 0.6;
	this.jumpHeight = 2000;

	// Initialize the character.
	init();

	/**
	  * Builds the character in depth-first order. The parts of are 
  	  * modelled by the following object hierarchy:
	  *
	  * - character (this.element)
	  *    - head
	  *       - face
	  *       - hair
	  *    - torso
	  *    - leftArm
	  *       - leftLowerArm
	  *    - rightArm
	  *       - rightLowerArm
	  *    - leftLeg
	  *       - rightLowerLeg
	  *    - rightLeg
	  *       - rightLowerLeg
	  *
	  * Also set up the starting values for evolving parameters throughout
	  * the game.
	  * 
	  */
	function init() {

		// Build the character.
		self.face = createBox(100, 100, 60, self.skinColor, 0, 0, 0);
		self.hair = createBox(105, 20, 65, self.hairColor, 0, 50, 0);
		self.head = createGroup(0, 260, -25);
		self.head.add(self.face);
		self.head.add(self.hair);

		self.torso = createBox(150, 190, 40, self.shirtColor, 0, 100, 0);

		self.leftLowerArm = createLimb(20, 120, 30, self.skinColor, 0, -170, 0);
		self.leftArm = createLimb(30, 140, 40, self.skinColor, -100, 190, -10);
		self.leftArm.add(self.leftLowerArm);

		self.rightLowerArm = createLimb(
			20, 120, 30, self.skinColor, 0, -170, 0);
		self.rightArm = createLimb(30, 140, 40, self.skinColor, 100, 190, -10);
		self.rightArm.add(self.rightLowerArm);

		self.leftLowerLeg = createLimb(40, 200, 40, self.skinColor, 0, -200, 0);
		self.leftLeg = createLimb(50, 170, 50, self.shortsColor, -50, -10, 30);
		self.leftLeg.add(self.leftLowerLeg);

		self.rightLowerLeg = createLimb(
			40, 200, 40, self.skinColor, 0, -200, 0);
		self.rightLeg = createLimb(50, 170, 50, self.shortsColor, 50, -10, 30);
		self.rightLeg.add(self.rightLowerLeg);

		self.element = createGroup(0, 0, -4000);
		self.element.add(self.head);
		self.element.add(self.torso);
		self.element.add(self.leftArm);
		self.element.add(self.rightArm);
		self.element.add(self.leftLeg);
		self.element.add(self.rightLeg);

		// Initialize the player's changing parameters.
		self.isJumping = false;
		self.isSwitchingLeft = false;
		self.isSwitchingRight = false;
		self.currentLane = 0;
		self.runningStartTime = new Date() / 1000;
		self.pauseStartTime = new Date() / 1000;
		self.stepFreq = 2;
		self.queuedActions = [];

	}

	/**
	 * Creates and returns a limb with an axis of rotation at the top.
	 *
	 * @param {number} DX The width of the limb.
	 * @param {number} DY The length of the limb.
	 * @param {number} DZ The depth of the limb.
	 * @param {color} COLOR The color of the limb.
	 * @param {number} X The x-coordinate of the rotation center.
	 * @param {number} Y The y-coordinate of the rotation center.
	 * @param {number} Z The z-coordinate of the rotation center.
	 * @return {THREE.GROUP} A group that includes a box representing
	 *                       the limb, with the specified properties.
	 *
	 */
	function createLimb(dx, dy, dz, color, x, y, z) {
	    var limb = createGroup(x, y, z);
	    var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
		var limbBox = createBox(dx, dy, dz, color, 0, offset, 0);
		limb.add(limbBox);
		return limb;
	}
	
	/**
	 * A method called on the character when time moves forward.
	 */
	this.update = function() {

		// Obtain the curren time for future calculations.
		var currentTime = new Date() / 1000;

		// Apply actions to the character if none are currently being
		// carried out.
		if (!self.isJumping &&
			!self.isSwitchingLeft &&
			!self.isSwitchingRight &&
			self.queuedActions.length > 0) {
			switch(self.queuedActions.shift()) {
				case "up":
					self.isJumping = true;
					self.jumpStartTime = new Date() / 1000;
					break;
				case "left":
					if (self.currentLane != -1) {
						self.isSwitchingLeft = true;
					}
					break;
				case "right":
					if (self.currentLane != 1) {
						self.isSwitchingRight = true;
					}
					break;
			}
		}

		// If the character is jumping, update the height of the character.
		// Otherwise, the character continues running.
		if (self.isJumping) {
			var jumpClock = currentTime - self.jumpStartTime;
			self.element.position.y = self.jumpHeight * Math.sin(
				(1 / self.jumpDuration) * Math.PI * jumpClock) +
				sinusoid(2 * self.stepFreq, 0, 20, 0,
					self.jumpStartTime - self.runningStartTime);
			if (jumpClock > self.jumpDuration) {
				self.isJumping = false;
				self.runningStartTime += self.jumpDuration;
			}
		} else {
			var runningClock = currentTime - self.runningStartTime;
			self.element.position.y = sinusoid(
				2 * self.stepFreq, 0, 20, 0, runningClock);
			self.head.rotation.x = sinusoid(
				2 * self.stepFreq, -10, -5, 0, runningClock) * deg2Rad;
			self.torso.rotation.x = sinusoid(
				2 * self.stepFreq, -10, -5, 180, runningClock) * deg2Rad;
			self.leftArm.rotation.x = sinusoid(
				self.stepFreq, -70, 50, 180, runningClock) * deg2Rad;
			self.rightArm.rotation.x = sinusoid(
				self.stepFreq, -70, 50, 0, runningClock) * deg2Rad;
			self.leftLowerArm.rotation.x = sinusoid(
				self.stepFreq, 70, 140, 180, runningClock) * deg2Rad;
			self.rightLowerArm.rotation.x = sinusoid(
				self.stepFreq, 70, 140, 0, runningClock) * deg2Rad;
			self.leftLeg.rotation.x = sinusoid(
				self.stepFreq, -20, 80, 0, runningClock) * deg2Rad;
			self.rightLeg.rotation.x = sinusoid(
				self.stepFreq, -20, 80, 180, runningClock) * deg2Rad;
			self.leftLowerLeg.rotation.x = sinusoid(
				self.stepFreq, -130, 5, 240, runningClock) * deg2Rad;
			self.rightLowerLeg.rotation.x = sinusoid(
				self.stepFreq, -130, 5, 60, runningClock) * deg2Rad;

			// If the character is not jumping, it may be switching lanes.
			if (self.isSwitchingLeft) {
				self.element.position.x -= 200;
				var offset = self.currentLane * 800 - self.element.position.x;
				if (offset > 800) {
					self.currentLane -= 1;
					self.element.position.x = self.currentLane * 800;
					self.isSwitchingLeft = false;
				}
			}
			if (self.isSwitchingRight) {
				self.element.position.x += 200;
				var offset = self.element.position.x - self.currentLane * 800;
				if (offset > 800) {
					self.currentLane += 1;
					self.element.position.x = self.currentLane * 800;
					self.isSwitchingRight = false;
				}
			}
		}
	}

	/**
	  * Handles character activity when the left key is pressed.
	  */
	this.onLeftKeyPressed = function() {
		self.queuedActions.push("left");
	}

	/**
	  * Handles character activity when the up key is pressed.
	  */
	this.onUpKeyPressed = function() {
		//self.queuedActions.push("up");
	}

	/**
	  * Handles character activity when the right key is pressed.
	  */
	this.onRightKeyPressed = function() {
		self.queuedActions.push("right");
	}

	/**
	  * Handles character activity when the game is paused.
	  */
	this.onPause = function() {
		self.pauseStartTime = new Date() / 1000;
	}

	/**
	  * Handles character activity when the game is unpaused.
	  */
	this.onUnpause = function() {
		var currentTime = new Date() / 1000;
		var pauseDuration = currentTime - self.pauseStartTime;
		self.runningStartTime += pauseDuration;
		if (self.isJumping) {
			self.jumpStartTime += pauseDuration;
		}
	}

}

/**
  * A collidable tree in the game positioned at X, Y, Z in the scene and with
  * scale S.
  */
function Tree(x, y, z, s) {

	// Explicit binding.
	var self = this;

	// The object portrayed in the scene.
	this.mesh = new THREE.Object3D();
    var top = createCylinder(1, 300, 300, 4, Colors.green, 0, 1000, 0);
    var mid = createCylinder(1, 400, 400, 4, Colors.green, 0, 800, 0);
    var bottom = createCylinder(1, 500, 500, 4, Colors.green, 0, 500, 0);
    var trunk = createCylinder(100, 100, 250, 32, Colors.brownDark, 0, 125, 0);
    this.mesh.add(top);
    this.mesh.add(mid);
    this.mesh.add(bottom);
    this.mesh.add(trunk);
    this.mesh.position.set(x, y, z);
	this.mesh.scale.set(s, s, s);
	this.scale = s;

	/**
	 * A method that detects whether this tree is colliding with the character,
	 * which is modelled as a box bounded by the given coordinate space.
	 */
    this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
    	var treeMinX = self.mesh.position.x - this.scale * 250;
    	var treeMaxX = self.mesh.position.x + this.scale * 250;
    	var treeMinY = self.mesh.position.y;
    	var treeMaxY = self.mesh.position.y + this.scale * 1150;
    	var treeMinZ = self.mesh.position.z - this.scale * 250;
    	var treeMaxZ = self.mesh.position.z + this.scale * 250;
    	return treeMinX <= maxX && treeMaxX >= minX
    		&& treeMinY <= maxY && treeMaxY >= minY
    		&& treeMinZ <= maxZ && treeMaxZ >= minZ;
    }

}

function Wall(x, y, z, s, color, respuesta_correcta, pregunta) {

	// Explicit binding.
	var self = this;

	// The object portrayed in the scene.
	this.mesh = new THREE.Object3D();
    //var trunk = createCylinder(600, 600, 250, 32, Colors.brownDark, 0, 125, 0);
	var wall = createBox(1000, 5000, 40, color, 0, 0, 0);
    this.mesh.add(wall);
    this.mesh.position.set(x, y, z);
	this.mesh.scale.set(s, s, s);
	this.scale = s;

	this.pregunta = pregunta;

	if(respuesta_correcta == true){
		this.respuesta_correcta = true;
	}else{
		this.respuesta_correcta = null;
	}

	/**
	 * A method that detects whether this tree is colliding with the character,
	 * which is modelled as a box bounded by the given coordinate space.
	 */
	this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
		var treeMinX = self.mesh.position.x - this.scale * 250;
		var treeMaxX = self.mesh.position.x + this.scale * 250;
		var treeMinY = self.mesh.position.y;
		var treeMaxY = self.mesh.position.y + this.scale * 1150;
		var treeMinZ = self.mesh.position.z - this.scale * 250;
		var treeMaxZ = self.mesh.position.z + this.scale * 250;
		return treeMinX <= maxX && treeMaxX >= minX
			&& treeMinY <= maxY && treeMaxY >= minY
			&& treeMinZ <= maxZ && treeMaxZ >= minZ;
	}
}

/** 
 *
 * UTILITY FUNCTIONS
 * 
 * Functions that simplify and minimize repeated code.
 *
 */

/**
 * Utility function for generating current values of sinusoidally
 * varying variables.
 *
 * @param {number} FREQUENCY The number of oscillations per second.
 * @param {number} MINIMUM The minimum value of the sinusoid.
 * @param {number} MAXIMUM The maximum value of the sinusoid.
 * @param {number} PHASE The phase offset in degrees.
 * @param {number} TIME The time, in seconds, in the sinusoid's scope.
 * @return {number} The value of the sinusoid.
 *
 */
function sinusoid(frequency, minimum, maximum, phase, time) {
	var amplitude = 0.5 * (maximum - minimum);
	var angularFrequency = 2 * Math.PI * frequency;
	var phaseRadians = phase * Math.PI / 180;
	var offset = amplitude * Math.sin(
		angularFrequency * time + phaseRadians);
	var average = (minimum + maximum) / 2;
	return average + offset;
}

/**
 * Creates an empty group of objects at a specified location.
 *
 * @param {number} X The x-coordinate of the group.
 * @param {number} Y The y-coordinate of the group.
 * @param {number} Z The z-coordinate of the group.
 * @return {Three.Group} An empty group at the specified coordinates.
 *
 */
function createGroup(x, y, z) {
	var group = new THREE.Group();
	group.position.set(x, y, z);
	return group;
}

/**
 * Creates and returns a simple box with the specified properties.
 *
 * @param {number} DX The width of the box.
 * @param {number} DY The height of the box.
 * @param {number} DZ The depth of the box.
 * @param {color} COLOR The color of the box.
 * @param {number} X The x-coordinate of the center of the box.
 * @param {number} Y The y-coordinate of the center of the box.
 * @param {number} Z The z-coordinate of the center of the box.
 * @param {boolean} NOTFLATSHADING True iff the flatShading is false.
 * @return {THREE.Mesh} A box with the specified properties.
 *
 */
function createBox(dx, dy, dz, color, x, y, z, notFlatShading) {
    var geom = new THREE.BoxGeometry(dx, dy, dz);
    var mat = new THREE.MeshPhongMaterial({
		color:color, 
    	flatShading: notFlatShading != true
    });
    var box = new THREE.Mesh(geom, mat);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(x, y, z);
    return box;
}

/**
 * Creates and returns a (possibly asymmetrical) cyinder with the 
 * specified properties.
 *
 * @param {number} RADIUSTOP The radius of the cylinder at the top.
 * @param {number} RADIUSBOTTOM The radius of the cylinder at the bottom.
 * @param {number} HEIGHT The height of the cylinder.
 * @param {number} RADIALSEGMENTS The number of segmented faces around 
 *                                the circumference of the cylinder.
 * @param {color} COLOR The color of the cylinder.
 * @param {number} X The x-coordinate of the center of the cylinder.
 * @param {number} Y The y-coordinate of the center of the cylinder.
 * @param {number} Z The z-coordinate of the center of the cylinder.
 * @return {THREE.Mesh} A box with the specified properties.
 */
function createCylinder(radiusTop, radiusBottom, height, radialSegments, 
						color, x, y, z) {
    var geom = new THREE.CylinderGeometry(
    	radiusTop, radiusBottom, height, radialSegments);
    var mat = new THREE.MeshPhongMaterial({
    	color: color,
    	flatShading: true
    });
    var cylinder = new THREE.Mesh(geom, mat);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.position.set(x, y, z);
    return cylinder;
}
