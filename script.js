// DOM Elements
        const gameContainer = document.getElementById('game-container');
        const scoreDisplay = document.getElementById('score');
        const restartBtn = document.getElementById('restart-btn');
        const messageBox = document.getElementById('message-box');

        // Initial references (will be updated when the level loads)
        let bunny = document.getElementById('bunny');
        let gate = document.getElementById('gate');
        // These arrays store the DOM elements for the collectibles in the current level
        let currentCarrots = [];
        let currentCabbages = [];
        let currentDandelions = [];
        let currentLilies = [];
        let currentMushrooms = [];

        // Variables for the level index, bunny position, speed and score
        let currentLevelIndex = 0; // Start at the first level (index 0)
        let bunnyX = 50;
        let bunnyY = 50;
        let bunnySpeed = 10; // Changed to 'let' to allow modification
        let score = 0;
        let gameOver = false;
		let windForce = 0;
		let windInterval = 0;
		let windTimer = null;
		let windDirection = { x: 0, y: 0 };

        // Variables for the mushroom effect
        let originalBunnyWidth = 64; // Store original bunny width
        let originalBunnyHeight = 64; // Store original bunny height
        let originalBunnySpeed = 10; // Store original bunny speed
        let mushroomEffectTimer = null; // setTimeout ID

        // Game boundaries inside the container
        let gameWidth = gameContainer.offsetWidth;
        let gameHeight = gameContainer.offsetHeight;

        // Level data
        const levels = [
            {
                name: "Level 1: The Sunny Meadow",
                bunnyStart: { x: 50, y: 50 },
                gatePosition: { x: 1100, y: 600 },
                collectibles: {
                    carrots: [
                        { x: 600, y: 200 }, { x: 800, y: 200 }, { x: 600, y: 100 },
                        { x: 800, y: 100 }, { x: 600, y: 10 }, { x: 300, y: 200 },
                        { x: 500, y: 100 }, { x: 300, y: 100 }, { x: 600, y: 400 },
                        { x: 900, y: 300 }, { x: 900, y: 100 }, { x: 500, y: 200 },
                        { x: 300, y: 500 }, { x: 700, y: 200 }, { x: 500, y: 400 },
                        { x: 800, y: 400 }, { x: 600, y: 500 }, { x: 300, y: 600 },
                        { x: 500, y: 600 }, { x: 900, y: 600 }, { x: 900, y: 500 },
                        { x: 300, y: 10 }, { x: 400, y: 300 }
                    ],
                    cabbages: [
                        { x: 800, y: 10 }, { x: 500, y: 300 }, { x: 400, y: 100 },
                        { x: 800, y: 300 }, { x: 700, y: 500 }, { x: 300, y: 400 },
                        { x: 400, y: 10 }, { x: 300, y: 300 }, { x: 700, y: 400 },
                        { x: 400, y: 600 }, { x: 400, y: 500 }, { x: 700, y: 300 }
                    ],
                    dandelions: [
                        { x: 900, y: 10 }, { x: 700, y: 10 }, { x: 400, y: 200 },
                        { x: 800, y: 500 }, { x: 600, y: 300 }, { x: 600, y: 600 },
                        { x: 500, y: 500 }, { x: 900, y: 400 }
                    ],
                    lilies: [
                        { x: 900, y: 200 }, { x: 400, y: 400 }, { x: 700, y: 100 },
                        { x: 500, y: 10 }, { x: 800, y: 600 }, { x: 700, y: 600 }
                    ],
                    mushrooms: [] // No mushrooms in level 1
                },
                scoreToUnlockGate: 20,
                backgroundStyle: 'repeating-linear-gradient(#b3ecb3, #a3e1a3 10px)'
            },
            {
                name: "Level 2: The Mushroom Forest",
                bunnyStart: { x: 50, y: 600 }, // Start at bottom left
                gatePosition: { x: 1100, y: 50 }, // Gate at top right
                collectibles: {
                    carrots: [
                        { x: 600, y: 200 }, { x: 800, y: 10 }, { x: 600, y: 100 },
                        { x: 800, y: 100 }, { x: 600, y: 10 }, { x: 300, y: 200 },
                        { x: 500, y: 100 }, { x: 700, y: 500 }, { x: 600, y: 400 },
                        { x: 900, y: 300 }, { x: 900, y: 100 }, { x: 500, y: 200 },
                        { x: 300, y: 500 }, { x: 700, y: 200 }, { x: 500, y: 400 },
                        { x: 800, y: 400 }, { x: 600, y: 500 }, { x: 300, y: 600 },
                        { x: 500, y: 600 }, { x: 900, y: 600 }, { x: 900, y: 500 },
                        { x: 300, y: 10 }
                    ],
                    cabbages: [
                        { x: 800, y: 200 }, { x: 500, y: 300 }, { x: 400, y: 100 },
                        { x: 800, y: 300 }, { x: 400, y: 600 }, { x: 300, y: 400 },
                        { x: 400, y: 10 }, { x: 300, y: 300 }, { x: 700, y: 400 }
                    ],
                    dandelions: [
                        { x: 900, y: 10 }, { x: 700, y: 10 }, { x: 400, y: 200 },
                        { x: 800, y: 500 }, { x: 600, y: 300 }, { x: 600, y: 600 },
                        { x: 500, y: 500 }, { x: 900, y: 400 }
                    ],
                    lilies: [
                        { x: 900, y: 200 }, { x: 400, y: 400 }, { x: 700, y: 100 },
                        { x: 500, y: 10 }, { x: 800, y: 600 }, { x: 700, y: 600 }
                    ],
                    mushrooms: [
                        { x: 700, y: 300 },
                        { x: 400, y: 500 },
                        { x: 400, y: 300 },
						{ x: 300, y: 100 }
                    ]
                },
                scoreToUnlockGate: 40,
                backgroundStyle: 'repeating-linear-gradient(#b3ecb3, #a3e1a3 10px)'
            },
            {
                name: "Level 3: The Snowy Mountain",
                bunnyStart: { x: 50, y: 350 }, // Start in middle left
                gatePosition: { x: 1100, y: 350 }, // Gate in middle right
                collectibles: {
                    carrots: [
                        { x: 600, y: 200 }, { x: 800, y: 200 }, { x: 600, y: 100 },
                        { x: 800, y: 100 }, { x: 600, y: 10 }, { x: 300, y: 200 },
                        { x: 500, y: 100 }, { x: 300, y: 100 }, { x: 600, y: 400 },
                        { x: 900, y: 300 }, { x: 900, y: 100 }, { x: 500, y: 200 },
                        { x: 300, y: 500 }, { x: 700, y: 200 }, { x: 500, y: 400 },
                        { x: 800, y: 400 }, { x: 600, y: 500 }, { x: 300, y: 600 },
                        { x: 500, y: 600 }, { x: 900, y: 600 }, { x: 900, y: 500 },
                        { x: 300, y: 10 }, { x: 400, y: 300 }
                    ],
                    cabbages: [
                        { x: 800, y: 10 }, { x: 500, y: 300 }, { x: 400, y: 100 },
                        { x: 800, y: 300 }, { x: 700, y: 500 }, { x: 300, y: 400 },
                        { x: 400, y: 10 }, { x: 300, y: 300 }, { x: 700, y: 400 },
                        { x: 400, y: 600 }, { x: 400, y: 500 }, { x: 700, y: 300 }
                    ],
                    dandelions: [
                        { x: 900, y: 10 }, { x: 700, y: 10 }, { x: 400, y: 200 },
                        { x: 800, y: 500 }, { x: 600, y: 300 }, { x: 600, y: 600 },
                        { x: 500, y: 500 }, { x: 900, y: 400 }
                    ],
                    lilies: [
                        { x: 900, y: 200 }, { x: 400, y: 400 }, { x: 700, y: 100 },
                        { x: 500, y: 10 }, { x: 800, y: 600 }, { x: 700, y: 600 }
                    ],
                    mushrooms: [] // No mushrooms in level 3
                },
                scoreToUnlockGate: 60,
				slippery: true,
                backgroundStyle: 'repeating-linear-gradient(#ffffff, #fffafa 10px)'
            },
			{
                name: "Level 4: The Midnight Marsh",
                bunnyStart: { x: 50, y: 600 }, // Start at bottom left
                gatePosition: { x: 1100, y: 50 }, // Gate at top right
                collectibles: {
                    carrots: [
                        { x: 600, y: 200 }, { x: 800, y: 10 }, { x: 600, y: 100 },
                        { x: 800, y: 100 }, { x: 600, y: 10 }, { x: 300, y: 200 },
                        { x: 500, y: 100 }, { x: 700, y: 500 }, { x: 600, y: 400 },
                        { x: 900, y: 300 }, { x: 900, y: 100 }, { x: 500, y: 200 },
                        { x: 300, y: 500 }, { x: 700, y: 200 }, { x: 500, y: 400 },
                        { x: 800, y: 400 }, { x: 600, y: 500 }, { x: 300, y: 600 },
                        { x: 300, y: 10 }, { x: 900, y: 600 }, { x: 900, y: 500 }
                    ],
                    cabbages: [
                        { x: 700, y: 400 }, { x: 500, y: 300 }, { x: 400, y: 100 },
                        { x: 800, y: 300 }, { x: 400, y: 600 }, { x: 300, y: 400 },
                        { x: 400, y: 10 }, { x: 300, y: 300 }
                    ],
                    dandelions: [
                        { x: 900, y: 10 }, { x: 700, y: 10 }, { x: 400, y: 200 },
                        { x: 800, y: 500 }, { x: 600, y: 300 }, { x: 600, y: 600 },
                        { x: 500, y: 500 }
                    ],
                    lilies: [
                        { x: 900, y: 200 }, { x: 400, y: 400 }, { x: 700, y: 100 },
                        { x: 500, y: 10 }, { x: 800, y: 600 }
                    ],
                    mushrooms: [
                        { x: 700, y: 300 },
                        { x: 400, y: 500 },
                        { x: 400, y: 300 },
						{ x: 300, y: 100 },
						{ x: 500, y: 600 },
						{ x: 800, y: 200 },
						{ x: 900, y: 400 },
						{ x: 700, y: 600 }
                    ],
					fireflies: [ { x: 1000, y: 200 }, { x: 200, y: 400 }, { x: 1100, y: 300 }, 
								{ x: 100: y: 500 }, { x: 1000, y: 600 }, { x: 50, y: 700 }, 
								{ x: 1200, y: 100 }, { x: 200, y: 800 }, { x: 1100, y: 500 }
					]
                },
                scoreToUnlockGate: 80,
                backgroundStyle: 'linear-gradient(to top, #225544 0%, #334466 60%, #112233 100%)'
            },
			{
                name: "Level 5: The Windy Cliffside",
                bunnyStart: { x: 50, y: 600 }, // Start at bottom left
                gatePosition: { x: 1100, y: 50 }, // Gate at top right
                collectibles: {
                    carrots: [
                        { x: 600, y: 200 }, { x: 800, y: 200 }, { x: 600, y: 100 },
                        { x: 800, y: 100 }, { x: 600, y: 10 }, { x: 300, y: 200 },
                        { x: 500, y: 100 }, { x: 300, y: 100 }, { x: 600, y: 400 },
                        { x: 900, y: 300 }, { x: 900, y: 100 }, { x: 500, y: 200 },
                        { x: 300, y: 500 }, { x: 700, y: 200 }, { x: 500, y: 400 },
                        { x: 800, y: 400 }, { x: 600, y: 500 }, { x: 300, y: 600 },
                        { x: 500, y: 600 }, { x: 900, y: 600 }, { x: 900, y: 500 },
                        { x: 300, y: 10 }, { x: 400, y: 300 }
                    ],
                    cabbages: [
                        { x: 800, y: 10 }, { x: 500, y: 300 }, { x: 400, y: 100 },
                        { x: 800, y: 300 }, { x: 700, y: 500 }, { x: 300, y: 400 },
                        { x: 400, y: 10 }, { x: 300, y: 300 }, { x: 700, y: 400 },
                        { x: 400, y: 600 }, { x: 400, y: 500 }, { x: 700, y: 300 }
                    ],
                    dandelions: [
                        { x: 900, y: 10 }, { x: 700, y: 10 }, { x: 400, y: 200 },
                        { x: 800, y: 500 }, { x: 600, y: 300 }, { x: 600, y: 600 },
                        { x: 500, y: 500 }, { x: 900, y: 400 }
                    ],
                    lilies: [
                        { x: 900, y: 200 }, { x: 400, y: 400 }, { x: 700, y: 100 },
                        { x: 500, y: 10 }, { x: 800, y: 600 }, { x: 700, y: 600 }
                    ],
                    mushrooms: [] // No mushrooms in level 5
                },
                scoreToUnlockGate: 100,
				windy: true, 
                backgroundStyle: 'repeating-linear-gradient(0deg, #deb887 0px, #deb887 20px, #a9a9a9 20px, #a9a9a9 40px, #d2b48c 40px, #f5deb3 60px)'
            }
        ];

        // Game functions

        // Function to show temporary messages (e.g., level start, game over)
        function showMessage(msg, duration = 3000) {
            messageBox.textContent = msg;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, duration);
        }

        // Function to update the score and check whether the gate should be visible or not
        function updateScore(amount) {
            if (gameOver) return;
            score += amount;
            scoreDisplay.textContent = 'Score: ' + score;

            if (score < 0) {
                endGame();
            }

            // Check whether the gate should become visible based on the current level's score boundaries 
            const currentLevelData = levels[currentLevelIndex];
            if (currentLevelData && score >= currentLevelData.scoreToUnlockGate) {
                gate.style.display = 'block';
            } else {
                gate.style.display = 'none';
            }
        }

        // Function to deal with game over
        function endGame() {
            gameOver = true;
            showMessage('Bunny ate too many poisonous plants! Game Over!');
            bunny.style.filter = 'grayscale(100%)';
        }

        // Function to deal with collision detection for two objects
        function checkCollision(rect1, rect2) {
            return rect1.left < rect2.right &&
                   rect1.right > rect2.left &&
                   rect1.top < rect2.bottom &&
                   rect1.bottom > rect2.top;
        }

        // Function to apply the mushroom effect (this shrinks and speeds up bunny for a short time)
        function applyMushroomEffect() {
            // Clear any existing timer to reset the effect duration
            if (mushroomEffectTimer) {
                clearTimeout(mushroomEffectTimer);
            }

            // Apply the shrinking effect (shrink bunny to half its original size)
            bunny.style.width = (originalBunnyWidth / 2) + 'px';
            bunny.style.height = (originalBunnyHeight / 2) + 'px';
            
            // Apply the speed up effect (bunny moves at double speed)
            bunnySpeed = originalBunnySpeed * 2;

			// Add the glow effect if on Level 4 (bunny eats glowing mushrooms)
  			if (currentLevelIndex === 3) {
    		bunny.classList.add('glow');
  			}

            // Set a timer to revert the mushroom effect after 5 seconds
            mushroomEffectTimer = setTimeout(revertMushroomEffect, 5000);
            showMessage("Mushroom power! Bunny has shrunk and gained speed!", 2000);
        }

        // Function to revert mushroom effect, show message and restore original bunny
        function revertMushroomEffect() {
            bunny.style.width = originalBunnyWidth + 'px';
            bunny.style.height = originalBunnyHeight + 'px';
            bunnySpeed = originalBunnySpeed;

			// Remove the glow effect if it was applied
  			if (currentLevelIndex === 3) {
   			bunny.classList.remove('glow');
  			}
            mushroomEffectTimer = null; // Clear the timer ID
            showMessage("Mushroom effect wore off.", 1500);
        }

		// Function to increment the level index and load the next level
        function nextLevel() {
            loadLevel(currentLevelIndex + 1);
        }

        // Function to reset the entire game to the first level
        function resetGame() {
            score = 0; // Reset score on full game restart
            revertMushroomEffect(); // Ensure that the mushroom effect is cleared on game restart
			if (windTimer) { // Clear the wind timer on game restart
   			 clearTimeout(windTimer);
  			}
            loadLevel(0); // Load the first level
            showMessage("Game restarted!"); // Show information about game restarting
        };

		// Function to apply wind effect
		function applyWindEffect() {
  			if (gameOver) return;

  			const currentLevelData = levels[currentLevelIndex];
  			if (currentLevelData.windy) {
    			// Generate a random wind force and direction
    			windForce = Math.random() * 5 + 1; // Random force between 1 and 6
    			windDirection = {
      			x: Math.random() * 2 - 1, // Random value between -1 and 1
      			y: Math.random() * 2 - 1
    		};

   	 	// Normalise the vector to ensure a consistent speed regardless of direction
    	const magnitude = Math.sqrt(windDirection.x * windDirection.x + windDirection.y * windDirection.y);
    		if (magnitude > 0) {
      			windDirection.x /= magnitude;
      			windDirection.y /= magnitude;
    		}

    	// Set a timer to change the wind effect again after a few seconds
    		if (windTimer) {
      			clearTimeout(windTimer);
    		}
    		windTimer = setTimeout(applyWindEffect, Math.random() * 3000 + 2000); // New wind effect every 2-5 seconds
  			}
		}		

        // Function to load elements for the current level
        function loadLevel(levelIndex) {
            // Revert any active mushroom effects when loading a new level
            revertMushroomEffect();

            // Check whether all levels have been completed
            if (levelIndex >= levels.length) {
                showMessage("Congratulations! You've completed all levels!", 5000);
                gameOver = true;
                gate.style.display = 'none'; // Hide gate if all levels are done
				if (windTimer) {
      				clearTimeout(windTimer);
    			}
                return;
            }

            currentLevelIndex = levelIndex;
            const levelData = levels[currentLevelIndex]; // Get the data for the new level
			// Check if the level is windy and start the wind effect
  			if (levelData.windy) {
    			applyWindEffect();
  			} else if (windTimer) {
   			 // Clear the wind timer if the next level is not windy
    			clearTimeout(windTimer);
    			windForce = 0; // Reset wind force
  			}

            gameContainer.style.background = levelData.backgroundStyle;
            gameContainer.style.borderColor = levelData.backgroundStyle === '#ffffff' ? '#add8e6' : 'green'; 
            
            // Clear all collectibles for the previous level from the DOM
            const collectiblesLayer = document.getElementById('collectibles-layer');
            collectiblesLayer.innerHTML = ''; // Clear all old collectible image elements

            // Reset the bunny's position to the start point of the new level
            bunnyX = levelData.bunnyStart.x;
            bunnyY = levelData.bunnyStart.y;
            bunny.style.left = bunnyX + 'px';
            bunny.style.top = bunnyY + 'px';
            bunny.style.filter = ''; // Ensure bunny is not in grayscale

            // Position the gate for the new level
            gate.style.left = levelData.gatePosition.x + 'px';
            gate.style.top = levelData.gatePosition.y + 'px';
            gate.style.display = 'none'; // Gate starts hidden on new level

            // Create and position the collectibles for the new level
            // Reset the arrays so that they hold references to the new DOM elements
            currentCarrots = [];
            currentCabbages = [];
            currentDandelions = [];
            currentLilies = [];
            currentMushrooms = [];

            // Helper function to create and append a collectible image
            const createCollectible = (type, src, x, y) => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = type;
                img.classList.add(type); // Add class for styling (e.g., .carrot, .cabbage)
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                collectiblesLayer.appendChild(img); // Add to the collectibles layer
                return img; // Return the created image element
            };

            // Populate the collectible arrays by creating images from levelData
            levelData.collectibles.carrots.forEach(pos => {
                currentCarrots.push(createCollectible('carrot', 'carrot.png', pos.x, pos.y));
            });
            levelData.collectibles.cabbages.forEach(pos => {
                currentCabbages.push(createCollectible('cabbage', 'cabbage.png', pos.x, pos.y));
            });
            levelData.collectibles.dandelions.forEach(pos => {
                currentDandelions.push(createCollectible('dandelion', 'dandelion.png', pos.x, pos.y));
            });
            levelData.collectibles.lilies.forEach(pos => {
                currentLilies.push(createCollectible('lily', 'lily.png', pos.x, pos.y));
            });
			// Add mushrooms to the level if applicable
			if (levelData.collectibles.mushrooms) {
  				levelData.collectibles.mushrooms.forEach(pos => {
    				const mushroomImg = createCollectible('mushroom', 'mushroom.png', pos.x, pos.y);
    				currentMushrooms.push(mushroomImg);

    				// Add the glow effect for mushrooms in level 4
    				if (currentLevelIndex === 3) {
     				 mushroomImg.classList.add('glow');
    				}
 				 });
			}

			// Add fireflies for visual effect
			if (levelData.collectibles.fireflies) {
    			levelData.collectibles.fireflies.forEach(pos => {
        			const firefly = document.createElement('div');
        			firefly.classList.add('firefly');
        			firefly.style.left = pos.x + 'px';
        			firefly.style.top = pos.y + 'px';
        			collectiblesLayer.appendChild(firefly);
    			});
			 }
			
            gameOver = false; // Reset the game over status for the new level
            updateScore(0); // Call updateScore to re-evaluate whether gate should be visible according to the new level score boundary
            showMessage(`Starting ${levelData.name}!`); // Show the name and number of the new level

			
			// Show the name and number of the new level, then show warnings if needed
    		const levelNameMsg = `Starting ${levelData.name}!`;
    		showMessage(levelNameMsg);

    		// If the level is slippery or windy, show a warning after the level name message disappears
    		if (levelData.slippery) {
        		setTimeout(() => {
            	showMessage("Careful! The snow is slippery!", 4000);
        			}, 3000); // Wait for the level name message duration (default 3000ms)
   			}
			if (levelData.windy) {
				 setTimeout(() => {
   				 showMessage("The wind is strong here!", 4000);
					}, 3000); // Wait for the level name message duration (default 3000ms)
			}
		}
        // Event listeners

			document.addEventListener('keydown', (e) => {
  			if (gameOver) return;

  			const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
  			if (!keys.includes(e.key)) return;

  			let newX = bunnyX;
  			let newY = bunnyY;

  			// Calculate the new position based on which key is pressed
  			if (e.key === 'ArrowRight') newX += bunnySpeed;
  			if (e.key === 'ArrowLeft') newX -= bunnySpeed;
  			if (e.key === 'ArrowDown') newY += bunnySpeed;
  			if (e.key === 'ArrowUp') newY -= bunnySpeed;

  			const currentLevelData = levels[currentLevelIndex];

  			// If the level is slippery, make bunny slide
  			if (currentLevelData.slippery) {
    		if (e.key === 'ArrowRight') newX += bunnySpeed / 2;
    		if (e.key === 'ArrowLeft') newX -= bunnySpeed / 2;
    		if (e.key === 'ArrowDown') newY += bunnySpeed / 2;
    		if (e.key === 'ArrowUp') newY -= bunnySpeed / 2;
  			}

  			// Add the wind effect for level 5
  			if (currentLevelData.windy) {
   				newX += windDirection.x * windForce;
    			newY += windDirection.y * windForce;
  			}

            // Keep the bunny within the container boundaries
            newX = Math.max(0, Math.min(gameWidth - bunny.offsetWidth, newX));
            newY = Math.max(0, Math.min(gameHeight - bunny.offsetHeight, newY));

            // Update the bunny's position on the screen
            bunnyX = newX;
            bunnyY = newY;
            bunny.style.left = bunnyX + 'px';
            bunny.style.top = bunnyY + 'px';

            // Add hop animation
            bunny.style.transform = 'translateY(-10px)';
            setTimeout(() => bunny.style.transform = 'translateY(0)', 100);

            // Get current bounding client rect for the bunny to check for collisions with collectibles
            const bunnyRect = bunny.getBoundingClientRect();

            // Check collisions for all the collectibles in the current level
            currentCarrots = currentCarrots.filter(carrot => {
                if (checkCollision(bunnyRect, carrot.getBoundingClientRect()) && carrot.style.display !== 'none') {
                    carrot.style.display = 'none';
                    updateScore(+1);
                    return false;
                }
                return true;
            });
            currentCabbages = currentCabbages.filter(cabbage => {
                if (checkCollision(bunnyRect, cabbage.getBoundingClientRect()) && cabbage.style.display !== 'none') {
                    cabbage.style.display = 'none';
                    updateScore(-1);
                    return false;
                }
                return true;
            });
            currentDandelions = currentDandelions.filter(dandelion => {
                if (checkCollision(bunnyRect, dandelion.getBoundingClientRect()) && dandelion.style.display !== 'none') {
                    dandelion.style.display = 'none';
                    updateScore(+5);
                    return false;
                }
                return true;
            });
            currentLilies = currentLilies.filter(lily => {
                if (checkCollision(bunnyRect, lily.getBoundingClientRect()) && lily.style.display !== 'none') {
                    lily.style.display = 'none';
                    updateScore(-10);
                    return false;
                }
                return true;
            });
            currentMushrooms = currentMushrooms.filter(mushroom => {
                if (checkCollision(bunnyRect, mushroom.getBoundingClientRect()) && mushroom.style.display !== 'none') {
                    mushroom.style.display = 'none';
                    updateScore(+2);
                    applyMushroomEffect(); // Call the new function here!
                    return false;
                }
                return true;
            });

            // Check for a collision with the gate (only if the gate is visible)
            if (gate.style.display === 'block') {
                const gateRect = gate.getBoundingClientRect();
                if (checkCollision(bunnyRect, gateRect)) {
                    nextLevel();
                }
            }
        });

        // Restart Button event listener
        restartBtn.addEventListener('click', resetGame);

        // Initialisation of the game
        // Adjust the game dimensions and bunny position when the window is resized
        window.addEventListener('resize', () => {
            gameWidth = gameContainer.offsetWidth;
            gameHeight = gameContainer.offsetHeight;
            // Reposition the bunny if it goes out of bounds during the resize (optional)
            bunnyX = Math.max(0, Math.min(gameWidth - bunny.offsetWidth, bunnyX));
            bunnyY = Math.max(0, Math.min(gameHeight - bunny.offsetHeight, bunnyY));
            bunny.style.left = bunnyX + 'px';
            bunny.style.top = bunnyY + 'px';
        });

        // Store the original bunny dimensions and speed on initial load
        bunny.onload = () => { // Ensure image is loaded before getting dimensions
            originalBunnyWidth = bunny.offsetWidth;
            originalBunnyHeight = bunny.offsetHeight;
            originalBunnySpeed = bunnySpeed; // Store initial speed
            loadLevel(currentLevelIndex); // Start the game by loading the first level
        };

        // Fallback in case image loads before the loading event
        if (bunny.complete) {
            originalBunnyWidth = bunny.offsetWidth;
            originalBunnyHeight = bunny.offsetHeight;
            originalBunnySpeed = bunnySpeed;
            loadLevel(currentLevelIndex);
        }













