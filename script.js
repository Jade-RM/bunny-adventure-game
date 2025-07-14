  const bunny = document.getElementById('bunny');
  const carrots = document.querySelectorAll('.carrot');
  const cabbages = document.querySelectorAll('.cabbage');
  const dandelions = document.querySelectorAll('.dandelion');
  const lilies = document.querySelectorAll('.lily');
  const scoreDisplay = document.getElementById('score');
  const restart = document.getElementById('restart-btn');
  let x = 50;
  let y = 50;
  bunny.style.left = x + 'px';
  bunny.style.top = y + 'px';
  const speed = 10;
  let score = 0;
  let gameOver = false;

  function updateScore(amount) {
    if (gameOver) return;
    score += amount;
    scoreDisplay.textContent = 'Score: ' + score;

    if (score < 0) {
      endGame();
    }
  }

  function endGame() {
    gameOver = true;
    scoreDisplay.textContent = 'Bunny has eaten too many poisonous plants! Game Over!';
    bunny.style.filter = 'grayscale(100%)';
  }
  
  document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(e.key)) return;

    if (e.key === 'ArrowRight') x += speed;
    if (e.key === 'ArrowLeft') x -= speed;
    if (e.key === 'ArrowDown') y += speed;
    if (e.key === 'ArrowUp') y -= speed;

    x = Math.max(0, Math.min(window.innerWidth - 64, x));
    y = Math.max(0, Math.min(window.innerHeight - 64, y));

    bunny.style.left = x + 'px';
    bunny.style.top = y + 'px';
    bunny.style.transform = 'translateY(-10px)';
    setTimeout(() => bunny.style.transform = 'translateY(0)', 100);

      // Check for carrot collisions
      carrots.forEach(carrot => {
        const rect1 = bunny.getBoundingClientRect();
        const rect2 = carrot.getBoundingClientRect();
        const overlap = !(rect1.right < rect2.left || 
                          rect1.left > rect2.right || 
                          rect1.bottom < rect2.top || 
                          rect1.top > rect2.bottom);
        if (overlap && carrot.style.display !== 'none') {
          carrot.style.display = 'none';
          updateScore(+1)
        }
      });
	  
	  // Check for cabbage collisions
      cabbages.forEach(cabbage => {
        const rect1 = bunny.getBoundingClientRect();
        const rect2 = cabbage.getBoundingClientRect();
        const overlap = !(rect1.right < rect2.left || 
                          rect1.left > rect2.right || 
                          rect1.bottom < rect2.top || 
                          rect1.top > rect2.bottom);
        if (overlap && cabbage.style.display !== 'none') {
          cabbage.style.display = 'none';
          updateScore(-1)
        }
      });
	  // Check for dandelion collisions
      dandelions.forEach(dandelion => {
        const rect1 = bunny.getBoundingClientRect();
        const rect2 = dandelion.getBoundingClientRect();
        const overlap = !(rect1.right < rect2.left || 
                          rect1.left > rect2.right || 
                          rect1.bottom < rect2.top || 
                          rect1.top > rect2.bottom);
        if (overlap && dandelion.style.display !== 'none') {
          dandelion.style.display = 'none';
          updateScore(+5)
        }
      });
	  
	   // Check for lily collisions
      lilies.forEach(lily => {
        const rect1 = bunny.getBoundingClientRect();
        const rect2 = lily.getBoundingClientRect();
        const overlap = !(rect1.right < rect2.left || 
                          rect1.left > rect2.right || 
                          rect1.bottom < rect2.top || 
                          rect1.top > rect2.bottom);
        if (overlap && lily.style.display !== 'none') {
          lily.style.display = 'none';
          updateScore(-10);
        }
      });
	  
	  if (score >= 20) {
        gate.style.display = 'block';
      }
	  
	   // Check for gate collision
        const bunnyRect = bunny.getBoundingClientRect();
        const gateRect = gate.getBoundingClientRect();
        const atGate = !(bunnyRect.right < gateRect.left || 
                   bunnyRect.left > gateRect.right || 
                   bunnyRect.bottom < gateRect.top || 
                   bunnyRect.top > gateRect.bottom);
        if (atGate && gate.style.display === 'block') {
        // Level up!
        alert("You have reached the gate! Go through it to enter the next level...");
        // Need to add a new level here so that the gate takes bunny to a new level
        // e.g.: window.location.href = "level2.html";
      }
    }); 
	
	restart.addEventListener('click', () => {
  // Reset position
  x = 50;
  y = 50;
  bunny.style.left = x + 'px';
  bunny.style.top = y + 'px';

  // Reset score
  score = 0;
  gameOver = false;
  bunny.style.filter = ''; // Remove grayscale if applied
  scoreDisplay.textContent = 'Score: 0';

  // Show all plants again
  carrots.forEach(carrot => carrot.style.display = 'block');
  cabbages.forEach(cabbage => cabbage.style.display = 'block');
  dandelions.forEach(dandelion => dandelion.style.display = 'block');
  lilies.forEach(lily => lily.style.display = 'block');

  // Hide gate again
  gate.style.display = 'none';
});