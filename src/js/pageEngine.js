/**
 * 3D Comic Book Page-Flip Navigation Engine
 * Features realistic book page turning & progressive off-screen reading drift.
 */

export class PageEngine {
  constructor(parallaxEngine) {
    this.parallaxEngine = parallaxEngine;
    this.pages = [];
    this.tabs = [];
    this.currentIndex = 0;
    this.isFlipping = false;
    this.flipDuration = 800; // ms for realistic paper curve

    this.container = document.querySelector('.comic-book-container');
    this.comicBook = document.querySelector('.comic-book');

    this.init();
  }

  init() {
    this.pages = Array.from(document.querySelectorAll('.comic-page'));
    this.tabs = Array.from(document.querySelectorAll('.tab-bookmark'));
    this.prevBtn = document.getElementById('btn-prev-page');
    this.nextBtn = document.getElementById('btn-next-page');
    this.pageIndicator = document.getElementById('page-indicator-text');

    if (this.pages.length === 0) return;

    // Read initial hash or default to first page
    const hash = window.location.hash.replace('#', '');
    let pageSlug = hash.startsWith('blog/') ? 'blog' : hash;
    let initialIndex = this.pages.findIndex(p => p.dataset.pageId === pageSlug);
    if (initialIndex === -1) initialIndex = 0;

    this.showPageInstant(initialIndex);

    // Setup tab clicks
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        if (index !== this.currentIndex) {
          this.goToPage(index);
        }
      });
    });

    // Prev / Next Floating Buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousPage());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextPage());
    }

    // Page Dog-Ear Curls
    document.querySelectorAll('.page-curl-right').forEach(curl => {
      curl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextPage();
      });
    });

    document.querySelectorAll('.page-curl-left').forEach(curl => {
      curl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.previousPage();
      });
    });

    // Keyboard Arrow Keys (Left / Right)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        this.nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.previousPage();
      }
    });

    // Touch Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const viewport = document.querySelector('.comic-pages-viewport') || document.body;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Only trigger if horizontal swipe is prominent (> 45px) and greater than vertical scroll
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (deltaX < 0) {
          this.nextPage(); // Swiped left -> next page
        } else {
          this.previousPage(); // Swiped right -> prev page
        }
      }
    }, { passive: true });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      const currentHash = window.location.hash.replace('#', '');
      const idx = this.pages.findIndex(p => p.dataset.pageId === currentHash);
      if (idx !== -1 && idx !== this.currentIndex) {
        this.goToPage(idx, false);
      }
    });

    // Setup modern mobile dropdown menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

    if (mobileMenuToggle && mobileNavDrawer) {
      mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileNavDrawer.classList.toggle('open');
        mobileMenuToggle.classList.toggle('open', isOpen);
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu if user clicks outside
      document.addEventListener('click', (e) => {
        if (!mobileNavDrawer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          mobileNavDrawer.classList.remove('open');
          mobileMenuToggle.classList.remove('open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    document.querySelectorAll('.mobile-menu-item').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
        if (mobileMenuToggle) {
          mobileMenuToggle.classList.remove('open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        this.goToPage(index);
      });
    });
  }

  showPageInstant(index) {
    this.currentIndex = index;
    this.pages.forEach((page, i) => {
      page.classList.remove('active', 'flipping-out-forward', 'flipping-in-forward', 'flipping-out-backward', 'flipping-in-backward');
      if (i === index) {
        page.classList.add('active');
      }
    });
    this.applyProgressiveOffScreenDrift(index);
    this.updateControls();
  }

  /**
   * Realistic Book Page Stacking Effect:
   * Dynamically adjusts the spine thickness and book drop shadows based on
   * the proportion of pages turned, keeping the entire site perfectly centered.
   */
  applyProgressiveOffScreenDrift(index) {
    if (!this.container || !this.comicBook) return;

    // Reset container translation so the site never gets pushed off-screen
    this.container.style.transform = 'none';
    
    // Adjust dynamic page-stack shadow and spine edge on the comic book
    const leftThickness = index * 3; // mm/px of turned pages on the left
    const rightThickness = (this.pages.length - 1 - index) * 3;

    this.comicBook.style.boxShadow = `
      0 20px 45px -10px rgba(15, 23, 42, 0.22),
      -${leftThickness + 4}px 8px 18px rgba(15, 23, 42, 0.15),
      ${rightThickness + 4}px 8px 18px rgba(15, 23, 42, 0.15),
      0 0 0 1px rgba(15, 23, 42, 0.08)
    `;

    this.container.style.setProperty('--page-index', index);
  }

  goToPage(targetIndex, updateHash = true) {
    if (this.isFlipping || targetIndex === this.currentIndex || targetIndex < 0 || targetIndex >= this.pages.length) {
      return;
    }

    this.isFlipping = true;
    const isForward = targetIndex > this.currentIndex;
    const oldPage = this.pages[this.currentIndex];
    const newPage = this.pages[targetIndex];

    // Clean up animation classes
    this.pages.forEach(p => {
      p.classList.remove('flipping-out-forward', 'flipping-in-forward', 'flipping-out-backward', 'flipping-in-backward');
    });

    if (isForward) {
      oldPage.classList.add('flipping-out-forward');
      newPage.classList.add('flipping-in-forward');
    } else {
      oldPage.classList.add('flipping-out-backward');
      newPage.classList.add('flipping-in-backward');
    }

    this.currentIndex = targetIndex;
    
    // Apply progressive off-screen drift
    this.applyProgressiveOffScreenDrift(targetIndex);
    this.updateControls();

    if (updateHash) {
      const pageId = newPage.dataset.pageId;
      if (pageId) {
        window.history.pushState(null, '', `#${pageId}`);
      }
    }

    setTimeout(() => {
      oldPage.classList.remove('active', 'flipping-out-forward', 'flipping-out-backward');
      newPage.classList.remove('flipping-in-forward', 'flipping-in-backward');
      newPage.classList.add('active');
      this.isFlipping = false;

      // Smoothly scroll back to top of viewport
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Refresh 3D tilt listeners
      if (this.parallaxEngine) {
        this.parallaxEngine.setupTiltCards();
      }
    }, this.flipDuration);
  }

  nextPage() {
    if (this.currentIndex < this.pages.length - 1) {
      this.goToPage(this.currentIndex + 1);
    }
  }

  previousPage() {
    if (this.currentIndex > 0) {
      this.goToPage(this.currentIndex - 1);
    }
  }

  updateControls() {
    // Update tabs
    this.tabs.forEach((tab, i) => {
      if (i === this.currentIndex) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex === this.pages.length - 1;
    }

    // Update page indicator
    if (this.pageIndicator && this.pages[this.currentIndex]) {
      const pageName = this.pages[this.currentIndex].dataset.pageTitle || `Page ${this.currentIndex + 1}`;
      this.pageIndicator.textContent = `PAGE ${this.currentIndex + 1} / ${this.pages.length} • ${pageName.toUpperCase()}`;
    }

    // Update mobile menu items
    document.querySelectorAll('.mobile-menu-item').forEach((link, i) => {
      if (i === this.currentIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
