/**
 * Dr. No's Interactive Mini-Comic Sampler & Reader Engine
 */

import { SAMPLER_COMIC_PAGES } from './comicData.js';

export class ComicReader {
  constructor() {
    this.pages = SAMPLER_COMIC_PAGES;
    this.currentPageIndex = 0;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.modal = document.getElementById('comic-reader-modal');
    this.pageNumberDisplay = document.getElementById('reader-page-num');
    this.pageLeftEl = document.getElementById('reader-page-left');
    this.pageRightEl = document.getElementById('reader-page-right');
    this.btnPrev = document.getElementById('reader-btn-prev');
    this.btnNext = document.getElementById('reader-btn-next');
    this.btnClose = document.getElementById('reader-btn-close');

    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => this.previousPage());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.nextPage());
    }
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    // Keydown handlers for comic reader
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.nextPage();
      if (e.key === 'ArrowLeft') this.previousPage();
    });
  }

  open(pageIndex = 0) {
    this.isOpen = true;
    this.currentPageIndex = pageIndex;
    if (this.modal) {
      this.modal.classList.add('open');
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
    }
    this.render();
  }

  close() {
    this.isOpen = false;
    if (this.modal) {
      this.modal.classList.remove('open');
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }
  }

  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      this.render();
    }
  }

  previousPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.render();
    }
  }

  render() {
    const pageData = this.pages[this.currentPageIndex];
    if (!pageData) return;

    if (this.pageNumberDisplay) {
      this.pageNumberDisplay.textContent = `ISSUE SPREAD ${this.currentPageIndex + 1} / ${this.pages.length}`;
    }

    if (this.btnPrev) {
      this.btnPrev.disabled = this.currentPageIndex === 0;
    }
    if (this.btnNext) {
      this.btnNext.disabled = this.currentPageIndex === this.pages.length - 1;
    }

    // Render Left Page (Atmospheric Story & Artwork)
    if (this.pageLeftEl) {
      this.pageLeftEl.innerHTML = `
        <div class="reader-caption">DR. NO'S QUANTUM ARCHIVE • MARIETTA, GA</div>
        <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: #0f172a; margin-bottom: 0.5rem;">${pageData.title}</h3>
        <p style="font-family: var(--font-comic); font-style: italic; font-size: 0.95rem; line-height: 1.4; margin-bottom: 1rem; color: #334155;">
          "${pageData.narration}"
        </p>
        
        <div style="flex: 1; border: 3px solid #0f172a; border-radius: 6px; overflow: hidden; position: relative; background: #0f172a; min-height: 240px; box-shadow: var(--shadow-comic);">
          <img src="./assets/hero_banner.jpg" style="width: 100%; height: 100%; object-fit: cover;" alt="Comic Scene Artwork" />
          <div class="sound-burst" style="position: absolute; bottom: 15px; left: 15px; font-size: 1.2rem; transform: rotate(-8deg);">
            CRACKLE!
          </div>
        </div>
      `;
    }

    // Render Right Page (Action Comic Panels & Dynamic Dialogue)
    if (this.pageRightEl) {
      this.pageRightEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem; height: 100%;">
          ${pageData.panels.map((panel, idx) => `
            <div class="reader-comic-panel" style="flex: 1; min-height: 160px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, #fff 0%, #f8fafc 100%); position: relative; border-color: #0f172a;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-family: var(--font-display); font-size: 1rem; background: #0f172a; color: var(--comic-yellow); padding: 0.1rem 0.5rem; border-radius: 4px;">${panel.caption}</span>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #64748b; font-weight: 700;">SPEAKER: ${panel.speaker}</span>
              </div>
              
              <div style="background: #ffffff; border: 2px solid #0f172a; border-radius: 12px; padding: 0.75rem 1rem; font-family: var(--font-comic); font-weight: 700; font-size: 0.95rem; line-height: 1.3; box-shadow: 2px 2px 0 #0f172a; margin-top: 0.5rem; position: relative; color: #0f172a;">
                "${panel.dialog}"
                <div style="position: absolute; bottom: -8px; left: 24px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #0f172a;"></div>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                <div class="sound-burst ${idx % 2 === 0 ? 'red' : 'blue'}" style="font-size: 0.95rem;">
                  ${idx % 2 === 0 ? 'KA-POW!' : 'THWIP!'}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
}
