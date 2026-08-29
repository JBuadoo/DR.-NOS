/**
 * Dr. No's Pull-Box / Comic Subscription Manager
 * Handles local storage state, dynamic tiered discounts, custom title entries, and reservation export.
 */

import confetti from 'canvas-confetti';

export class PullListManager {
  constructor() {
    this.storageKey = 'drnos_pull_box_v2';
    this.items = this.loadItems();
    this.init();
  }

  loadItems() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not load pull list from localStorage', e);
    }
    // Default starter items
    return [
      {
        id: 'nr-1',
        title: 'Chrono Knight #1: Masters of Time',
        publisher: 'Dr. No Exclusive',
        price: 4.99,
        quantity: 1,
        variant: 'Foil Virgin Variant'
      },
      {
        id: 'nr-2',
        title: 'Night Blade #1: Neo-Kyoto Protocol',
        publisher: 'Image Comics',
        price: 4.99,
        quantity: 1,
        variant: 'Regular Cover A'
      }
    ];
  }

  saveItems() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Could not save pull list', e);
    }
  }

  addItem(comic) {
    const existing = this.items.find(item => item.id === comic.id || item.title === comic.title);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.items.push({
        id: comic.id || 'custom-' + Date.now(),
        title: comic.title,
        publisher: comic.publisherLabel || comic.publisher || 'Comic Series',
        price: Number(comic.price) || 4.99,
        quantity: 1,
        variant: comic.variant || 'Standard Cover'
      });
    }

    this.saveItems();
    this.render();
    this.updatePullBadge();

    // Trigger mini celebratory confetti
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#facc15', '#ef4444', '#0284c7']
        });
      }
    } catch (e) {
      console.warn('Confetti effect skipped', e);
    }
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveItems();
    this.render();
    this.updatePullBadge();
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.removeItem(index);
        return;
      }
      this.saveItems();
      this.render();
      this.updatePullBadge();
    }
  }

  getCalculations() {
    const totalTitles = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Tiered Discount Logic
    let discountPercent = 0;
    let tierName = "Standard Member";
    if (totalTitles >= 10) {
      discountPercent = 0.20; // 20% off
      tierName = "SuperStore Elite (20% OFF)";
    } else if (totalTitles >= 5) {
      discountPercent = 0.15; // 15% off
      tierName = "VIP Pull Box (15% OFF)";
    } else if (totalTitles >= 1) {
      discountPercent = 0.10; // 10% off
      tierName = "Subscriber Rate (10% OFF)";
    }

    const discountAmount = subtotal * discountPercent;
    const finalTotal = subtotal - discountAmount;

    return {
      totalTitles,
      subtotal,
      discountPercent: discountPercent * 100,
      discountAmount,
      finalTotal,
      tierName
    };
  }

  updatePullBadge() {
    const countEl = document.getElementById('header-pull-count');
    const tabBadge = document.getElementById('tab-pull-badge');
    const total = this.items.reduce((sum, i) => sum + i.quantity, 0);
    if (countEl) countEl.textContent = total;
    if (tabBadge) tabBadge.textContent = total;
  }

  init() {
    this.container = document.getElementById('pulllist-items-container');
    this.summaryContainer = document.getElementById('pulllist-summary-container');
    this.customForm = document.getElementById('pull-custom-form');

    if (this.customForm) {
      this.customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('pull-custom-title');
        const pubInput = document.getElementById('pull-custom-publisher');
        if (titleInput && titleInput.value.trim()) {
          this.addItem({
            title: titleInput.value.trim(),
            publisherLabel: pubInput ? pubInput.value.trim() : 'Custom Title',
            price: 4.99
          });
          titleInput.value = '';
          if (pubInput) pubInput.value = '';
        }
      });
    }

    this.render();
    this.updatePullBadge();
  }

  render() {
    if (!this.container || !this.summaryContainer) return;

    if (this.items.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border: 2px dashed var(--border-subtle); border-radius: 10px;">
          <h3 class="font-display" style="font-size: 1.6rem; color: #0f172a; margin-bottom: 0.5rem;">YOUR PULL-BOX IS CURRENTLY EMPTY</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Never miss an issue! Add upcoming Wednesday drops or custom ongoing series below.</p>
        </div>
      `;
    } else {
      this.container.innerHTML = this.items.map((item, index) => `
        <div class="pull-item-row">
          <div style="flex: 1;">
            <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a;">${item.title}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); display: flex; gap: 0.75rem; margin-top: 0.2rem;">
              <span><strong>Pub:</strong> ${item.publisher}</span>
              <span><strong>Cover:</strong> ${item.variant || 'Standard'}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="font-family: var(--font-display); font-size: 1.25rem; color: #0f172a;">$${(item.price * item.quantity).toFixed(2)}</div>
            <div style="display: flex; align-items: center; gap: 0.35rem; background: var(--bg-surface-elevated); border: 2px solid #0f172a; border-radius: 6px; padding: 0.2rem;">
              <button class="pull-qty-btn" data-action="dec" data-index="${index}" style="background: none; border: none; color: #0f172a; cursor: pointer; padding: 0 6px; font-weight: 900;">-</button>
              <span style="font-weight: 800; min-width: 18px; text-align: center; color: #0f172a;">${item.quantity}</span>
              <button class="pull-qty-btn" data-action="inc" data-index="${index}" style="background: none; border: none; color: #0f172a; cursor: pointer; padding: 0 6px; font-weight: 900;">+</button>
            </div>
            <button class="pull-remove-btn" data-index="${index}" style="background: var(--comic-red); border: 1px solid #0f172a; color: #fff; border-radius: 4px; padding: 0.3rem 0.5rem; cursor: pointer; font-size: 0.8rem; font-weight: 700;">✕</button>
          </div>
        </div>
      `).join('');

      // Attach quantity / remove events
      this.container.querySelectorAll('.pull-qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          const action = btn.dataset.action;
          this.updateQuantity(idx, action === 'inc' ? 1 : -1);
        });
      });

      this.container.querySelectorAll('.pull-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          this.removeItem(idx);
        });
      });
    }

    // Render Summary
    const calc = this.getCalculations();
    this.summaryContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.75rem;">
        <h3 class="font-display" style="font-size: 1.4rem; color: #0f172a;">BOX SUMMARY</h3>
        <span class="pull-badge-discount">${calc.tierName}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem; margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Active Pulls:</span>
          <strong style="color: #0f172a;">${calc.totalTitles} titles / issues</strong>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Estimated Retail:</span>
          <span>$${calc.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--comic-green);">
          <span>Dr. No's Subscriber Savings (${calc.discountPercent}%):</span>
          <span>-$${calc.discountAmount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Bag & Board Protection:</span>
          <span style="color: #0f172a; font-weight: 800;">FREE</span>
        </div>
      </div>

      <div style="border-top: 2px solid #0f172a; padding-top: 0.85rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-family: var(--font-display); font-size: 1.2rem; color: #0f172a;">ESTIMATED TOTAL:</span>
        <span class="comic-title-burst" style="font-size: 1.6rem; color: #0f172a;">$${calc.finalTotal.toFixed(2)}</span>
      </div>

      <button id="btn-export-pull" class="btn btn-primary" style="width: 100%; margin-bottom: 0.75rem;">
        RESERVE / EXPORT PULL CODE 🚀
      </button>
      <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">
        Drop off at Dr. No's Blackwell Square or email to manager@drnos.com for instant box setup.
      </p>
    `;

    const exportBtn = document.getElementById('btn-export-pull');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.showExportModal());
    }
  }

  showExportModal() {
    const calc = this.getCalculations();
    const modalBackdrop = document.getElementById('generic-modal-backdrop');
    const modalTitle = document.getElementById('generic-modal-title');
    const modalBody = document.getElementById('generic-modal-body');

    if (!modalBackdrop || !modalBody) return;

    const pullCode = 'DRNO-PULL-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    modalTitle.textContent = "DR. NO'S PULL BOX RESERVATION";
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div class="sound-burst" style="font-size: 1.1rem; margin-bottom: 0.75rem;">RESERVATION CODE GENERATED</div>
        <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 900; background: #0f172a; color: var(--comic-yellow); padding: 0.75rem; border: 2px solid var(--comic-yellow); border-radius: 8px; letter-spacing: 0.15em;">
          ${pullCode}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
          Bring this code to Dr. No's Comics in Marietta or present it at the counter for your subscriber discount.
        </p>
      </div>

      <div style="background: #f8fafc; border: 2px solid #0f172a; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <h4 style="color: #0f172a; font-family: var(--font-display); margin-bottom: 0.5rem;">RESERVED TITLES:</h4>
        <ul style="list-style: square inside; font-size: 0.9rem; color: #334155; line-height: 1.6;">
          ${this.items.map(item => `<li><strong>${item.title}</strong> (${item.quantity}x) — $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: 1rem;">
        <button id="btn-copy-pull-code" class="btn btn-primary" style="flex: 1;">
          📋 COPY RESERVATION SLIP
        </button>
        <button id="btn-close-modal-action" class="btn btn-secondary">
          CLOSE
        </button>
      </div>
    `;

    modalBackdrop.classList.add('open');

    const copyBtn = document.getElementById('btn-copy-pull-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = `DR. NO'S PULL BOX RESERVATION\nCode: ${pullCode}\nItems:\n` + 
          this.items.map(i => `- ${i.title} (${i.quantity}x)`).join('\n') + 
          `\nTotal Estimated: $${calc.finalTotal.toFixed(2)}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.textContent = 'COPIED TO CLIPBOARD! ✨';
        });
      });
    }

    const closeBtn = document.getElementById('btn-close-modal-action');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    }
  }
}
