let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0; // Generalized start X for touch/mouse
  startY = 0; // Generalized start Y for touch/mouse
  moveX = 0; // Generalized move X for touch/mouse
  moveY = 0; // Generalized move Y for touch/mouse
  prevX = 0; // Previous X position for touch/mouse
  prevY = 0; // Previous Y position for touch/mouse
  velX = 0; // Velocity X
  velY = 0; // Velocity Y
  rotation = Math.random() * 30 - 15; // Initial random rotation
  currentPaperX = 0; // Current translation X
  currentPaperY = 0; // Current translation Y
  rotating = false; // Rotation flag

  init(paper) {
    const startHandler = (x, y, isRotating = false) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      this.rotating = isRotating;

      paper.style.zIndex = highestZ++;
      this.startX = x;
      this.startY = y;
      this.prevX = x;
      this.prevY = y;
    };

    const moveHandler = (x, y) => {
      if(!this.holdingPaper) return;

      this.moveX = x;
      this.moveY = y;
      
      if(!this.rotating) {
        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      } else {
        // Rotation logic remains unchanged
        const dirX = this.moveX - this.startX;
        const dirY = this.moveY - this.startY;
        const angle = Math.atan2(dirY, dirX);
        this.rotation = (360 + Math.round(180 * angle / Math.PI)) % 360;
      }

      this.prevX = this.moveX;
      this.prevY = this.moveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Touch events
    paper.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      startHandler(touch.clientX, touch.clientY);
    }, {passive: false});

    paper.addEventListener('touchmove', e => {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      moveHandler(touch.clientX, touch.clientY);
    }, {passive: false});

    paper.addEventListener('touchend', endHandler);

    // Mouse events
    paper.addEventListener('mousedown', e => {
      startHandler(e.clientX, e.clientY, e.button === 2); // Right click for rotating
    });

    document.addEventListener('mousemove', e => {
      moveHandler(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', endHandler);

    // Context menu (right click) prevention during rotation
    paper.addEventListener('contextmenu', e => {
      if (this.rotating) e.preventDefault();
    });
  }
}

// Initialization for all .paper elements
const papers = document.querySelectorAll('.paper');
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
