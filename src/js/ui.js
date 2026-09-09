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
    this.currentTheme = localStorage.getItem('comic_theme') || 'light';

    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeSelector();
    this.setupStoreStatus();
    this.setupSideSlideshow();
    this.setupFCBDCountdown();
    this.renderTournaments();
    this.renderNewReleases();
    this.renderGrailVault();
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
    localStorage.setItem('comic_theme', theme);

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
        <strong style="color: var(--comic-green); font-weight: 800;">STORE IS OPEN NOW</strong> • Welcome!
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

  renderNewReleases() {
    const container = document.getElementById('new-releases-grid');
    if (!container) return;

    const filtered = this.activeFilter === 'all' 
      ? NEW_RELEASES 
      : NEW_RELEASES.filter(c => c.publisher.toLowerCase() === this.activeFilter.toLowerCase());

    container.innerHTML = filtered.map(comic => `
      <div class="comic-release-card tilt-card" data-comic-id="${comic.id}">
        <span class="publisher-tag publisher-${comic.publisher}">
          ${comic.publisherLabel || comic.publisher}
        </span>
        <div class="release-cover-wrap">
          <img src="${comic.cover}" alt="${comic.title}" loading="lazy" />
        </div>
        <div class="release-body">
          <div>
            <h4 class="release-title">${comic.title}</h4>
            <div class="release-creators">By ${comic.writer} & ${comic.artist}</div>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.75rem;">
              ${comic.description}
            </p>
          </div>
          <div class="release-footer">
            <span class="release-price">$${comic.price.toFixed(2)}</span>
            <button class="btn btn-primary btn-add-pull" data-id="${comic.id}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
              + PULL BOX
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Pull Box buttons
    container.querySelectorAll('.btn-add-pull').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const comic = NEW_RELEASES.find(c => c.id === btn.dataset.id);
        if (comic && this.pullList) {
          this.pullList.addItem(comic);
        }
      });
    });

    // Category filter buttons
    const filterButtons = document.querySelectorAll('.releases-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter || 'all';
        this.renderNewReleases();
      });
    });
  }

  renderGrailVault() {
    const container = document.getElementById('grail-vault-grid');
    if (!container) return;

    container.innerHTML = GRAIL_VAULT.map(grail => `
      <div class="slab-card tilt-card" data-grail-id="${grail.id}">
        <div class="slab-header">
          <div class="slab-grade-box">
            <span class="slab-grade-score">${grail.grade}</span>
            <span class="slab-grade-type">${grail.gradeType}</span>
          </div>
          <span class="slab-cert-badge">${grail.cert}</span>
        </div>
        <div class="slab-cover-frame">
          <img src="${grail.cover}" alt="${grail.title}" class="slab-cover-img" loading="lazy" />
          <div class="slab-hologram"></div>
        </div>
        <div class="slab-info">
          <h4 class="slab-title">${grail.title}</h4>
          <div class="slab-meta">
            <span>${grail.publisher}</span>
            <span class="slab-price">$${grail.price.toLocaleString()}</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.4;">
            ${grail.notes}
          </p>
          <div style="margin-top: 0.75rem;">
            <button class="btn btn-outline-comic btn-inquire-grail" data-id="${grail.id}" style="width: 100%; font-size: 0.82rem; padding: 0.4rem 0.6rem;">
              💎 INQUIRE / HOLD SLAB
            </button>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-inquire-grail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const grail = GRAIL_VAULT.find(g => g.id === btn.dataset.id);
        if (grail) {
          this.showGrailModal(grail);
        }
      });
    });
  }

  showGrailModal(grail) {
    const modalBackdrop = document.getElementById('generic-modal-backdrop');
    const modalTitle = document.getElementById('generic-modal-title');
    const modalBody = document.getElementById('generic-modal-body');

    if (!modalBackdrop || !modalBody) return;

    modalTitle.textContent = `COLLECTOR SLAB: ${grail.title}`;
    modalBody.innerHTML = `
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 1.5rem;">
        <div style="max-width: 180px; flex-shrink: 0;">
          <img src="${grail.cover}" alt="${grail.title}" style="width: 100%; border: 2px solid #0f172a; border-radius: 6px;" />
        </div>
        <div style="flex: 1; min-width: 240px;">
          <div class="sound-burst red" style="font-size: 0.85rem; margin-bottom: 0.4rem;">${grail.gradeType} • GRADE ${grail.grade}</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; color: #0f172a;">${grail.title}</h3>
          <p style="font-size: 0.9rem; color: #334155; line-height: 1.5; margin-bottom: 0.75rem;">${grail.notes}</p>
          <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem;">
            $${grail.price.toLocaleString()}
          </div>
          <span style="font-size: 0.75rem; color: #64748b; font-family: var(--font-mono);">Certification: ${grail.cert}</span>
        </div>
      </div>
      <div style="background: #f1f5f9; border: 1.5px solid #0f172a; border-radius: 6px; padding: 0.85rem; margin-bottom: 1.25rem; font-size: 0.88rem; color: #334155;">
        To place a hold on this vintage graded comic, call our counter at <strong>(555) 123-4567</strong> or email <strong>contact@yourcomicshop.example</strong> referencing <strong>${grail.cert}</strong>.
      </div>
      <button id="btn-close-grail-modal" class="btn btn-primary" style="width: 100%;">
        CLOSE WINDOW
      </button>
    `;

    modalBackdrop.classList.add('open');

    const closeBtn = document.getElementById('btn-close-grail-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    }
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
        const arrivalsIdx = this.pageEngine.pages.findIndex(p => p.getAttribute('data-page-id') === 'new-arrivals' || p.getAttribute('data-page-id') === 'newreleases');
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
