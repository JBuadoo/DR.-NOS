/**
 * UI Controls, Theme Manager, Dynamic Renderers & Modals (Light Mode Default, No SFX)
 */

import { NEW_RELEASES, GRAIL_VAULT, TCG_TOURNAMENTS } from './comicData.js';

export class UIManager {
  constructor(pullListManager, comicReader, pageEngine) {
    this.pullList = pullListManager;
    this.reader = comicReader;
    this.pageEngine = pageEngine;
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.currentTheme = localStorage.getItem('drnos_theme') || 'light';

    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeSelector();
    this.setupStoreStatus();
    this.setupSideSlideshow();
    this.setupFCBDCountdown();
    this.renderTournaments();
    this.setupModals();
    this.setupQuickTriggers();
  }

  setupSideSlideshow() {
    const container = document.getElementById('side-spotlight-slideshow');
    if (!container) return;

    const slides = container.querySelectorAll('.slideshow-slide');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, 4500); // Transitions smoothly every 4.5 seconds
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('drnos_theme', theme);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Graphic Novel Mode';
    });
  }

  setupThemeSelector() {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(nextTheme);
        const msg = nextTheme === 'dark' ? 'Dark Graphic Novel Mode ✨' : 'Modern Clean Light Mode ✨';
        this.showThemeToast(btn, msg);
      });
    });
  }

  setupFCBDCountdown() {
    const daysEl = document.getElementById('fcbd-days');
    const hoursEl = document.getElementById('fcbd-hours');
    const minsEl = document.getElementById('fcbd-minutes');
    const secsEl = document.getElementById('fcbd-seconds');
    const targetDateEl = document.getElementById('fcbd-target-date');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Helper to calculate the first Saturday of May for any year
    const getNextFCBDDate = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      const getFirstSaturdayOfMay = (year) => {
        // Month index 4 is May (0-indexed)
        const mayFirst = new Date(year, 4, 1, 9, 0, 0); // 9:00 AM kickoff
        const dayOfWeek = mayFirst.getDay(); // 0 is Sunday, 6 is Saturday
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
        return new Date(year, 4, 1 + daysUntilSaturday, 9, 0, 0);
      };

      let target = getFirstSaturdayOfMay(currentYear);

      // If current year's FCBD has already passed (plus 24h for event duration), target next year's first Saturday of May
      if (now.getTime() > target.getTime() + 24 * 60 * 60 * 1000) {
        target = getFirstSaturdayOfMay(currentYear + 1);
      }

      return target;
    };

    const targetDate = getNextFCBDDate();
    if (targetDateEl) {
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      targetDateEl.textContent = `Next FCBD: ${targetDate.toLocaleDateString('en-US', options)}`;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        if (targetDateEl) targetDateEl.textContent = '🎉 FREE COMIC BOOK DAY IS TODAY! 🎉';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(minutes).padStart(2, '0');
      secsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  setupStoreStatus() {
    const statusPill = document.getElementById('store-live-status');
    if (!statusPill) return;

    // Dr. No's is open Mon-Sat 11am-8pm, Sun 12pm-6pm EST
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();

    let isOpen = false;
    if (day === 0) {
      isOpen = hour >= 12 && hour < 18;
    } else {
      isOpen = hour >= 11 && hour < 20;
    }

    if (isOpen) {
      statusPill.innerHTML = `
        <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981;"></span>
        <strong style="color: var(--comic-green); font-weight: 800;">STORE IS OPEN NOW</strong> • Blackwell Sq, Marietta
      `;
    } else {
      statusPill.innerHTML = `
        <span style="display: inline-block; width: 10px; height: 10px; background: var(--comic-red); border-radius: 50%;"></span>
        <strong class="store-closed-status">CURRENTLY CLOSED</strong> • Opens 11 AM Tomorrow
      `;
    }
  }

  renderTournaments() {
    const container = document.getElementById('tcg-events-grid');
    if (!container) return;

    container.innerHTML = TCG_TOURNAMENTS.map(event => `
      <div class="tournament-card tilt-card">
        <div style="display: flex; justify-content: space-between; align-items: center; min-height: 48px;">
          ${event.logo ? `
            <img src="${event.logo}" alt="${event.game}" style="max-height: 42px; max-width: 140px; object-fit: contain;" />
          ` : `
            <span class="game-icon-pill ${event.gameClass}">
              ⚔️ ${event.game}
            </span>
          `}
          <span style="font-size: 0.78rem; color: var(--comic-yellow); font-weight: 800; background: var(--bg-surface); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--comic-yellow);">
            ${event.game}
          </span>
        </div>

        <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); line-height: 1.3; margin-top: 0.3rem;">
          ${event.event}
        </h4>

        <div style="background: var(--bg-surface-elevated); border: 2px solid var(--border-comic); border-radius: 6px; padding: 0.65rem 0.85rem; font-size: 0.85rem;">
          <div class="event-time-highlight" style="margin-bottom: 0.25rem;">🕒 ${event.dayTime}</div>
          <div style="color: var(--text-secondary); margin-bottom: 0.15rem;">Format: <strong>${event.format}</strong></div>
          <div style="color: var(--text-secondary);">Cost: <strong style="color: var(--text-primary);">${event.entry}</strong></div>
        </div>

        <div class="amber-highlight-box" style="padding: 0.5rem 0.75rem; font-size: 0.82rem; margin-top: auto;">
          <strong class="event-prize-highlight">🏆 PRIZE / REWARDS:</strong>
          <div style="color: var(--text-primary); font-weight: 700; margin-top: 0.15rem;">${event.prize}</div>
        </div>
      </div>
    `).join('');
  }

  setupModals() {
    const backdrop = document.getElementById('generic-modal-backdrop');
    const closeBtn = document.getElementById('generic-modal-close');

    if (backdrop && closeBtn) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('open');
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
      });
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
          document.documentElement.classList.remove('modal-open');
          document.body.classList.remove('modal-open');
        }
      });
    }
  }

  setupQuickTriggers() {
    // Jump to upcoming events in hero
    const heroEventsBtn = document.getElementById('hero-btn-events');
    if (heroEventsBtn) {
      heroEventsBtn.addEventListener('click', () => {
        const eventsIdx = this.pageEngine.pages.findIndex(p => p.getAttribute('data-page-id') === 'events');
        if (eventsIdx !== -1) {
          this.pageEngine.goToPage(eventsIdx);
        }
      });
    }

    // Jump to pull list button in hero
    const heroPullBtn = document.getElementById('hero-btn-pull-list');
    if (heroPullBtn) {
      heroPullBtn.addEventListener('click', () => {
        const pullIdx = this.pageEngine.pages.findIndex(p => p.getAttribute('data-page-id') === 'ordering');
        if (pullIdx !== -1) {
          this.pageEngine.goToPage(pullIdx);
        }
      });
    }

    // Jump to new arrivals in hero
    const heroReleasesBtn = document.getElementById('hero-btn-new-releases');
    if (heroReleasesBtn) {
      heroReleasesBtn.addEventListener('click', () => {
        const arrivalsIdx = this.pageEngine.pages.findIndex(p => p.getAttribute('data-page-id') === 'newreleases');
        if (arrivalsIdx !== -1) {
          this.pageEngine.goToPage(arrivalsIdx);
        }
      });
    }
  }

  showThemeToast(btn, message) {
    if (!btn) return;

    // If an active theme popover already exists, update its content in place!
    if (this.themeToastEl && document.body.contains(this.themeToastEl)) {
      clearTimeout(this.themeToastTimeout);
      this.themeToastEl.innerHTML = `<span>🎨</span> <span>${message}</span>`;
      this.themeToastEl.classList.remove('updating');
      void this.themeToastEl.offsetWidth; // trigger CSS reflow for animation restart
      this.themeToastEl.classList.add('updating');

      // Update position in case of scroll/viewport adjustments
      this.positionThemeToast(btn, this.themeToastEl);

      this.themeToastTimeout = setTimeout(() => {
        this.dismissThemeToast();
      }, 2200);
      return;
    }

    // Otherwise create a single new popover element
    const toast = document.createElement('div');
    toast.className = 'theme-popover-toast';
    toast.innerHTML = `<span>🎨</span> <span>${message}</span>`;
    document.body.appendChild(toast);
    this.themeToastEl = toast;

    this.positionThemeToast(btn, toast);

    this.themeToastTimeout = setTimeout(() => {
      this.dismissThemeToast();
    }, 2200);
  }

  positionThemeToast(btn, toast) {
    const rect = btn.getBoundingClientRect();
    const toastRect = toast.getBoundingClientRect();
    
    // Position directly below button with gap
    const top = rect.bottom + 8;
    
    // Align horizontally with the right edge of the button, keeping within viewport
    let left = rect.right - toastRect.width;
    if (left < 12) left = 12;
    if (left + toastRect.width > window.innerWidth - 12) {
      left = window.innerWidth - toastRect.width - 12;
    }

    toast.style.top = `${top}px`;
    toast.style.left = `${left}px`;
  }

  dismissThemeToast() {
    if (this.themeToastEl && document.body.contains(this.themeToastEl)) {
      this.themeToastEl.style.opacity = '0';
      this.themeToastEl.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        if (this.themeToastEl && this.themeToastEl.parentNode) {
          this.themeToastEl.remove();
          this.themeToastEl = null;
        }
      }, 250);
    }
  }

  showToast(message) {
    const container = document.getElementById('comic-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'comic-toast';
    toast.innerHTML = `<span>💥</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}
