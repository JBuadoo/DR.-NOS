/**
 * Parallax & 3D Interactive Tilt Coordinator
 */

export class ParallaxEngine {
  constructor() {
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.init();
  }

  init() {
    // Parallax elements
    this.starsLayer = document.querySelector('.parallax-layer-stars');
    this.skylineLayer = document.querySelector('.parallax-layer-skyline');
    this.floatingBursts = document.querySelectorAll('.floating-comic-burst');
    this.heroBgArt = document.querySelector('.hero-bg-art');
    this.heroContent = document.querySelector('.hero-content-layer');

    // Attach mouse & scroll listeners
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Setup interactive 3D tilt cards
    this.setupTiltCards();

    // Start requestAnimationFrame loop
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  onMouseMove(e) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    this.mouse.targetX = (e.clientX - halfW) / halfW;
    this.mouse.targetY = (e.clientY - halfH) / halfH;
  }

  onScroll() {
    this.scrollY = window.scrollY || window.pageYOffset;
  }

  setupTiltCards() {
    const cards = document.querySelectorAll('.tilt-card, .slab-card, .comic-release-card, .tournament-card, .staff-card');
    
    cards.forEach((card) => {
      if (card.dataset.tiltInitialized === 'true') return;
      card.dataset.tiltInitialized = 'true';

      if (!card.querySelector('.tilt-card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-card-glare';
        card.appendChild(glare);
      }

      let rect = null;

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease';
      });

      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        const glare = card.querySelector('.tilt-card-glare');
        if (glare) {
          const glareX = (x / rect.width) * 100;
          const glareY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`;
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        rect = null;
        card.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        const glare = card.querySelector('.tilt-card-glare');
        if (glare) {
          glare.style.opacity = '0';
        }
      });
    });
  }

  render() {
    // Smooth interpolation for mouse movements
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    const mx = this.mouse.x;
    const my = this.mouse.y;

    // Parallax background transformations
    if (this.starsLayer) {
      const offsetX = mx * -20;
      const offsetY = my * -16;
      this.starsLayer.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
    }

    if (this.skylineLayer) {
      const offsetX = mx * 14;
      const offsetY = my * 8;
      this.skylineLayer.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
    }

    // Parallax floating sound effects
    if (this.floatingBursts && this.floatingBursts.length > 0) {
      this.floatingBursts.forEach((burst, index) => {
        const speed = 12 + (index * 6);
        const floatX = mx * speed;
        const floatY = my * speed + Math.sin(Date.now() * 0.002 + index) * 6;
        burst.style.transform = `translate3d(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px, 0)`;
      });
    }

    // Parallax Hero banner internal depth
    if (this.heroBgArt) {
      const bgX = mx * -24;
      const bgY = my * -20;
      this.heroBgArt.style.transform = `scale(1.12) translate3d(${bgX.toFixed(2)}px, ${bgY.toFixed(2)}px, 0)`;
    }

    if (this.heroContent) {
      const contentX = mx * 12;
      const contentY = my * 10;
      this.heroContent.style.transform = `translate3d(${contentX.toFixed(2)}px, ${contentY.toFixed(2)}px, 0)`;
    }

    requestAnimationFrame(this.render);
  }
}
